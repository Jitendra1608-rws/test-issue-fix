const express = require('express');
const path = require('node:path');
const cookieParser = require('cookie-parser');
const { sanitizeForHtml } = require('./utils/helpers');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

/** Safe math parser - no eval/Function, only + - * / ( ) and numbers */
function safeEvalMath(expr) {
  if (typeof expr !== 'string') return Number.NaN;
  const sanitized = expr.replaceAll(/[^\d\s+\-*/().]/g, '');
  if (sanitized.length === 0) return Number.NaN;
  try {
    const tokens = sanitized.match(/\d+\.?\d*|[+\-*/()]/g) || [];
    let i = 0;
    function parseExpr() {
      let left = parseTerm();
      while (tokens[i] === '+' || tokens[i] === '-') {
        const op = tokens[i++];
        const right = parseTerm();
        left = op === '+' ? left + right : left - right;
      }
      return left;
    }
    function parseTerm() {
      let left = parseFactor();
      while (tokens[i] === '*' || tokens[i] === '/') {
        const op = tokens[i++];
        const right = parseFactor();
        left = op === '*' ? left * right : left / right;
      }
      return left;
    }
    function parseFactor() {
      if (tokens[i] === '(') {
        i++;
        const v = parseExpr();
        i++;
        return v;
      }
      return Number(tokens[i++]);
    }
    return parseExpr();
  } catch {
    return Number.NaN;
  }
}

app.get('/calc', (req, res) => {
  const expr = req.query.expression || '1+1';
  const result = safeEvalMath(expr);
  if (Number.isNaN(result)) {
    res.status(400).send({ error: 'Invalid expression' });
    return;
  }
  res.send({ result });
});

app.get('/encode', (req, res) => {
  const text = req.query.text || 'hello';
  const buf = Buffer.from(text, 'utf8');
  res.send({ encoded: buf.toString('base64') });
});

// Routes
app.use('/api', require('./routes/api'));
app.use('/auth', require('./routes/auth'));
app.use('/user', require('./routes/user'));

app.get('/', (req, res) => {
  const userInput = sanitizeForHtml(req.query.q ?? '');
  res.render('index', { title: 'Test App', userInput });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
