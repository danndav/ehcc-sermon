'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import Hls from 'hls.js';
import { Play, Pause, Maximize, Minimize, Volume2, VolumeX, Settings } from 'lucide-react';
import { API_BASE_URL } from '@/lib/constants';
import { getToken } from '@/lib/auth';

interface HlsPlayerProps {
  sermonId: string;
  isFree?: boolean;
  onProgress?: (seconds: number) => void;
  resumeAt?: number;
  poster?: string;
}

const QUALITY_LABELS: Record<number, string> = {
  1080: '1080p',
  720: '720p',
  480: '480p',
  360: '360p',
};

export function HlsPlayer({ sermonId, isFree = true, onProgress, resumeAt, poster }: HlsPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [subscriptionRequired, setSubscriptionRequired] = useState(false);

  // Quality state
  const [qualities, setQualities] = useState<{ height: number; index: number }[]>([]);
  const [currentQuality, setCurrentQuality] = useState(-1); // -1 = auto
  const [showQualityMenu, setShowQualityMenu] = useState(false);

  const fetchStreamUrl = useCallback(async () => {
    try {
      const token = getToken();
      const res = await fetch(
        `${API_BASE_URL}/videos/${sermonId}/stream?isFree=${isFree}`,
        { headers: token ? { Authorization: `Bearer ${token}` } : {} },
      );

      if (res.status === 403) {
        const data = await res.json();
        if (data.error === 'subscription_required') {
          setSubscriptionRequired(true);
          setLoading(false);
          return null;
        }
      }

      if (!res.ok) throw new Error('Failed to get stream URL');

      const { url } = await res.json();
      return url;
    } catch {
      setError('Unable to load video');
      setLoading(false);
      return null;
    }
  }, [sermonId, isFree]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let hls: Hls | null = null;

    const initPlayer = async () => {
      const streamUrl = await fetchStreamUrl();
      if (!streamUrl) return;

      // Safari has native HLS support
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = streamUrl;
        setLoading(false);
        if (resumeAt) video.currentTime = resumeAt;
        return;
      }

      if (!Hls.isSupported()) {
        setError('Your browser does not support HLS video playback');
        return;
      }

      hls = new Hls({
        startLevel: -1, // Auto quality
        capLevelToPlayerSize: true,
      });
      hlsRef.current = hls;

      hls.loadSource(streamUrl);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, (_event, data) => {
        setLoading(false);
        // Build quality list
        const levels = data.levels.map((level, index) => ({
          height: level.height,
          index,
        }));
        setQualities(levels.sort((a, b) => b.height - a.height));
        if (resumeAt) video.currentTime = resumeAt;
      });

      hls.on(Hls.Events.LEVEL_SWITCHED, (_event, data) => {
        setCurrentQuality(data.level);
      });

      hls.on(Hls.Events.ERROR, (_event, data) => {
        if (data.fatal) {
          setError('Video playback error');
        }
      });
    };

    initPlayer();

    return () => {
      if (hls) {
        hls.destroy();
        hlsRef.current = null;
      }
    };
  }, [sermonId, fetchStreamUrl, resumeAt]);

  // Progress tracking — save every 10 seconds
  useEffect(() => {
    if (playing && onProgress) {
      progressIntervalRef.current = setInterval(() => {
        if (videoRef.current) {
          onProgress(Math.floor(videoRef.current.currentTime));
        }
      }, 10000);
    }
    return () => {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, [playing, onProgress]);

  // Auto-hide controls
  useEffect(() => {
    if (!playing) return;
    const timeout = setTimeout(() => setShowControls(false), 3000);
    return () => clearTimeout(timeout);
  }, [playing, showControls]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
      setPlaying(true);
    } else {
      video.pause();
      setPlaying(false);
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
      setFullscreen(false);
    } else {
      containerRef.current.requestFullscreen();
      setFullscreen(true);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = Number(e.target.value);
    setCurrentTime(video.currentTime);
  };

  const switchQuality = (levelIndex: number) => {
    if (hlsRef.current) {
      hlsRef.current.currentLevel = levelIndex; // -1 = auto
      setCurrentQuality(levelIndex);
    }
    setShowQualityMenu(false);
  };

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = Math.floor(s % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const qualityLabel = currentQuality === -1
    ? 'Auto'
    : QUALITY_LABELS[qualities.find((q) => q.index === currentQuality)?.height || 0] || 'Auto';

  // Subscription paywall
  if (subscriptionRequired) {
    return (
      <div className="relative bg-hero rounded-xl overflow-hidden aspect-video flex items-center justify-center">
        {poster && <img src={poster} alt="" className="absolute inset-0 w-full h-full object-cover opacity-30" />}
        <div className="relative text-center px-6">
          <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-3">
            <Play size={24} className="text-white ml-1" />
          </div>
          <p className="text-white text-[16px] font-medium mb-1">Subscribe to watch</p>
          <p className="text-white/60 text-[13px] mb-4">This sermon is available for subscribers</p>
          <a
            href="/profile/subscription"
            className="inline-block bg-[#4A1572] text-white rounded-full px-6 py-2.5 text-[13px] font-medium hover:opacity-90 transition-all"
          >
            View plans
          </a>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative bg-black rounded-xl overflow-hidden aspect-video group"
      onMouseMove={() => setShowControls(true)}
      onClick={togglePlay}
    >
      <video
        ref={videoRef}
        className="w-full h-full"
        poster={poster}
        playsInline
        onTimeUpdate={() => setCurrentTime(videoRef.current?.currentTime || 0)}
        onDurationChange={() => setDuration(videoRef.current?.duration || 0)}
        onEnded={() => setPlaying(false)}
      />

      {/* Loading spinner */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="w-10 h-10 border-3 border-white/30 border-t-white rounded-full animate-spin" />
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/70">
          <p className="text-white/80 text-[13px]">{error}</p>
        </div>
      )}

      {/* Controls overlay */}
      {!loading && !error && (
        <div
          className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-opacity ${
            showControls ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Center play/pause */}
          <button
            onClick={togglePlay}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center hover:bg-white/25 transition-colors"
          >
            {playing ? <Pause size={24} className="text-white" /> : <Play size={24} className="text-white ml-1" />}
          </button>

          {/* Bottom bar */}
          <div className="absolute bottom-0 left-0 right-0 px-3 pb-3 space-y-1.5">
            {/* Progress bar */}
            <input
              type="range"
              min={0}
              max={duration || 0}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-1 appearance-none bg-white/30 rounded-full outline-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
            />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button onClick={togglePlay}>
                  {playing ? <Pause size={18} className="text-white" /> : <Play size={18} className="text-white" />}
                </button>
                <button onClick={toggleMute}>
                  {muted ? <VolumeX size={18} className="text-white" /> : <Volume2 size={18} className="text-white" />}
                </button>
                <span className="text-white text-[11px]">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {/* Quality selector (V-08) */}
                <div className="relative">
                  <button
                    onClick={() => setShowQualityMenu(!showQualityMenu)}
                    className="flex items-center gap-1 text-white text-[11px] px-1.5 py-0.5 rounded bg-white/10 hover:bg-white/20 transition-colors"
                  >
                    <Settings size={13} />
                    {qualityLabel}
                  </button>
                  {showQualityMenu && (
                    <div className="absolute bottom-8 right-0 bg-black/90 rounded-lg py-1 min-w-[100px] z-10">
                      <button
                        onClick={() => switchQuality(-1)}
                        className={`block w-full text-left px-3 py-1.5 text-[12px] transition-colors ${
                          currentQuality === -1 ? 'text-[#9B59B6]' : 'text-white hover:bg-white/10'
                        }`}
                      >
                        Auto
                      </button>
                      {qualities.map((q) => (
                        <button
                          key={q.index}
                          onClick={() => switchQuality(q.index)}
                          className={`block w-full text-left px-3 py-1.5 text-[12px] transition-colors ${
                            currentQuality === q.index ? 'text-[#9B59B6]' : 'text-white hover:bg-white/10'
                          }`}
                        >
                          {QUALITY_LABELS[q.height] || `${q.height}p`}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <button onClick={toggleFullscreen}>
                  {fullscreen ? <Minimize size={18} className="text-white" /> : <Maximize size={18} className="text-white" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
