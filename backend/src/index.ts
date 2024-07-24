import app from './app';

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`🚀 server is listening to requests on http://localhost${PORT}`)
});
