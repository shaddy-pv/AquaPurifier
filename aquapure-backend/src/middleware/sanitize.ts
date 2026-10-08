import { Request, Response, NextFunction } from 'express';

/**
 * Deeply sanitizes an object against NoSQL operator injection ($gt, $ne, $where, etc.)
 */
function cleanNoSqlOperators(obj: any): boolean {
  if (!obj || typeof obj !== 'object') return false;

  let hasThreat = false;
  for (const key of Object.keys(obj)) {
    if (key.startsWith('$') || key.includes('.')) {
      hasThreat = true;
      delete obj[key];
    } else if (typeof obj[key] === 'object' && obj[key] !== null) {
      if (cleanNoSqlOperators(obj[key])) {
        hasThreat = true;
      }
    }
  }
  return hasThreat;
}

export const noSqlSanitizer = (req: Request, res: Response, next: NextFunction) => {
  let threatFound = false;

  if (req.body && typeof req.body === 'object') {
    if (cleanNoSqlOperators(req.body)) threatFound = true;
  }
  if (req.query && typeof req.query === 'object') {
    if (cleanNoSqlOperators(req.query)) threatFound = true;
  }
  if (req.params && typeof req.params === 'object') {
    if (cleanNoSqlOperators(req.params)) threatFound = true;
  }

  if (threatFound) {
    return res.status(400).json({
      message: 'Malicious query syntax rejected (NoSQL operator injection detected)'
    });
  }

  next();
};
