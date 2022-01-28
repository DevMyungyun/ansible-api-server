const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
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

app.use(cors());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/inventory', inventoryRouter);
app.use('/ivtHst', invHstRouter);
app.use('/jobevent', jobeventRouter);
app.use('/host', hostRouter);
app.use('/jobtemp', jobtempRouter);
app.use('/job', jobRouter);
app.use('/cred', credRouter);
app.use('/adhoc', adhocRouter);
app.use('/dbSetting', dbSettingRouter);

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