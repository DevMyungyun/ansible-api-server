const createError = require('http-errors');
const express = require('express');
const path = require('path');

const cookieParser = require('cookie-parser');
const logger = require('morgan');

const helmet = require('helmet');
const cors = require('cors');

const indexRouter = require('./routes/index');
const inventoryRouter = require('./routes/inventory');
const invHstRouter = require('./routes/inv_hst');
const jobeventRouter = require('./routes/jobevent');
const hostRouter = require('./routes/host');
const jobtempRouter = require('./routes/jobtemp');
const jobRouter = require('./routes/job');
const credRouter = require('./routes/credential');
const adhocRouter = require('./routes/adhoc');
const dbSettingRouter = require('./routes/dbSetting');


const app = express();

app.use(helmet());
app.use(cors());

// header setting
app.disable('x-powered-by');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());

app.use('/v1/', indexRouter);
app.use('/v1/inventory', inventoryRouter);
app.use('/v1/ivtHst', invHstRouter);
app.use('/v1/jobevent', jobeventRouter);
app.use('/v1/host', hostRouter);
app.use('/v1/jobtemp', jobtempRouter);
app.use('/v1/job', jobRouter);
app.use('/v1/cred', credRouter);
app.use('/v1/adhoc', adhocRouter);
app.use('/v1/dbSetting', dbSettingRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;