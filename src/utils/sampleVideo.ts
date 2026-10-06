// Helper to generate a sample celebration video Blob in-browser using HTML5 Canvas & MediaRecorder
export function generateSampleCelebrationVideoBlob(
  leaderShift: string = 'A',
  monthLabel: string = 'Temmuz 2026'
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 1280;
      canvas.height = 720;
      const ctx = canvas.getContext('2d');

      if (!ctx || !canvas.captureStream) {
        reject(new Error('Canvas video capture not supported in this environment'));
        return;
      }

      const stream = canvas.captureStream(30); // 30 FPS
      const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
        ? 'video/webm;codecs=vp9'
        : MediaRecorder.isTypeSupported('video/webm')
        ? 'video/webm'
        : 'video/mp4';

      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      const chunks: Blob[] = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const videoBlob = new Blob(chunks, { type: mimeType });
        resolve(videoBlob);
      };

      mediaRecorder.start();

      let frame = 0;
      const totalFrames = 30 * 10; // 10 seconds of video

      const particles: Array<{
        x: number;
        y: number;
        vx: number;
        vy: number;
        color: string;
        size: number;
      }> = [];

      const colors = ['#f59e0b', '#3b82f6', '#10b981', '#ffffff', '#ec4899', '#8b5cf6'];
      for (let i = 0; i < 70; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 4,
          vy: Math.random() * 3 + 1,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: Math.random() * 8 + 4,
        });
      }

      function draw() {
        if (frame >= totalFrames) {
          mediaRecorder.stop();
          return;
        }

        // Background
        const grad = ctx!.createLinearGradient(0, 0, canvas.width, canvas.height);
        grad.addColorStop(0, '#0f172a');
        grad.addColorStop(0.5, '#1e1b4b');
        grad.addColorStop(1, '#020617');
        ctx!.fillStyle = grad;
        ctx!.fillRect(0, 0, canvas.width, canvas.height);

        // Animated particles
        particles.forEach((p) => {
          ctx!.fillStyle = p.color;
          ctx!.beginPath();
          ctx!.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx!.fill();

          p.x += p.vx;
          p.y += p.vy;
          if (p.y > canvas.height) p.y = -10;
          if (p.x < 0) p.x = canvas.width;
          if (p.x > canvas.width) p.x = 0;
        });

        // Trophy / Medallion glow
        const pulse = Math.sin(frame * 0.1) * 15;
        ctx!.save();
        ctx!.shadowColor = '#f59e0b';
        ctx!.shadowBlur = 40 + pulse;
        ctx!.fillStyle = '#f59e0b';
        ctx!.beginPath();
        ctx!.arc(canvas.width / 2, 240, 80 + pulse * 0.5, 0, Math.PI * 2);
        ctx!.fill();
        ctx!.restore();

        // Inner Trophy icon text
        ctx!.fillStyle = '#0f172a';
        ctx!.font = 'bold 70px sans-serif';
        ctx!.textAlign = 'center';
        ctx!.textBaseline = 'middle';
        ctx!.fillText('🏆', canvas.width / 2, 240);

        // Headers
        ctx!.fillStyle = '#fbbf24';
        ctx!.font = '900 32px sans-serif';
        ctx!.textAlign = 'center';
        ctx!.fillText(`EREN TEKSTİL · ${monthLabel.toUpperCase()} ŞAMPİYONU`, canvas.width / 2, 380);

        ctx!.fillStyle = '#ffffff';
        ctx!.font = '900 54px sans-serif';
        ctx!.fillText(`TEBRİKLER VARDİYA ${leaderShift}!`, canvas.width / 2, 450);

        ctx!.fillStyle = '#93c5fd';
        ctx!.font = '700 28px sans-serif';
        ctx!.fillText(`"BAŞARI EKİP İŞİDİR"`, canvas.width / 2, 510);

        // Subtitle
        ctx!.fillStyle = '#94a3b8';
        ctx!.font = '500 20px sans-serif';
        ctx!.fillText(`Üstün Randıman & Rekor Üretim Tebrik Videosu`, canvas.width / 2, 560);

        // Progress bar inside video
        const progress = frame / totalFrames;
        ctx!.fillStyle = 'rgba(255, 255, 255, 0.2)';
        ctx!.fillRect(240, 640, 800, 10);
        ctx!.fillStyle = '#f59e0b';
        ctx!.fillRect(240, 640, 800 * progress, 10);

        frame++;
        requestAnimationFrame(draw);
      }

      draw();
    } catch (err) {
      reject(err);
    }
  });
}
