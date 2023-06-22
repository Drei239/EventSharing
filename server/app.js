var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');

const connectDatabase = require('./config/database');
const { errorMiddleware } = require('./middleware/errorMiddleware');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var eventsRouter = require('./routes/events');
var categoryRouter = require('./routes/category');
var uploadRouter = require('./routes/upload');
var orderRouter = require('./routes/orders');
var cors = require('cors');
var app = express();

//Export from config/database
connectDatabase();

// view engine setup

app.use(
  cors({
    credentials: true,
    origin: 'http://localhost:3001',
  })
);
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/events', eventsRouter);
app.use('/category', categoryRouter);
app.use('/upload', uploadRouter);
app.use('/orders', orderRouter);

process.env.TZ = 'Asia/Jakarta';

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});
// function errorHandler(err, req, res, next) {
//   console.error(err.message);
//   res.status(500).json({ error: "Internal Server Error" });
// }
// app.use(errorHandler);
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
