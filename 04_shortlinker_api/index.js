const express = require('express');
const createClient = require('@supabase/supabase-js');
const randomstring = require('randomstring');

const app = express();
const supabaseUrl = 'https://trssxkvziifyrbrftgtx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRyc3N4a3Z6aWlmeXJicmZ0Z3R4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODc2NDAwMzcsImV4cCI6MjAwMzIxNjAzN30.57Xw_fsbMqJC6qLgr6DDWyoQwev-7hQNfik6oegs-Lo';
const supabase = createClient.createClient(supabaseUrl, supabaseKey);

app.use(express.json());

app.post('/short', async (req, res) => {
    try {
        const link = req.body.link;
        const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/;

        if (!urlRegex.test(link)) {
            return res.status(400).json({ error: "Invalid URL format" });
        }

        const shortlink = randomstring.generate({length: 7});

        const { error } = await supabase.from('shortlinks').insert([{"original_URL": link, "shortlink": shortlink}]);
        res.status(200).send('http://localhost:5000/' + shortlink);
    } catch (e) {
        res.status(500).send(e);
    }
});

app.get('/:shortlink', async (req, res) => {
    try {
        const shortlink = req.params.shortlink;

        const link = await supabase.from('shortlinks').select('original_URL').eq('shortlink', shortlink);
        res.redirect(link.data[0].original_URL);
    } catch (e) {
        res.status(500).send(e);
    }
});

const port = 5000;
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});