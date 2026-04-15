const createApp = require('./createApp');

const app = createApp();
const port = process.env.PORT || 5000;

app.listen(port, () => {
   
  console.log(`server berjalan pada port ${port}`);
});
