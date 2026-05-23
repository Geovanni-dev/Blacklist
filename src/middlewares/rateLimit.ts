import { rateLimit } from "express-rate-limit"; // importação do express-rate-limit

class RateLimitMiddleware {
    private blockedIps: Record<string, number> = {};

    public middleware() {
            return rateLimit({
            windowMs: 60 * 1000, // 1 minuto
            max: 15, // Limite de solicitações por minuto
    
            handler: (req, res) => {// Função pra lidar com o bloqueio
            const ip = req.ip ?? "";
            const now = Date.now();
            // Verifica se o IP foi bloqueado
            if (this.blockedIps[ip] && now < this.blockedIps[ip]) {
            const secondsLeft = Math.ceil((this.blockedIps[ip] - now) / 1000); // coverte o blockedIps para segundos
            return res.status(429).json({
            error: `Ainda bloqueado. Por favor, tente novamente  em ${secondsLeft} segundos.`
        });
    }
        this.blockedIps[ip] = now +(5 * 60 * 1000); // bloqueia por 5 minutos
        return res.status(429).json({
            error: "Muitas solicitações. Por favor, tente novamente mais tarde."
        });
      }
    })
  }
};
export const rateLimitMiddleware = new RateLimitMiddleware();
