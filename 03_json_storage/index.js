const express = require('express');
const createClient = require('@supabase/supabase-js');

const app = express();
app.use(express.json());

const supabaseUrl = 'https://aymbzrsryvdodoryblne.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF5bWJ6cnNyeXZkb2RvcnlibG5lIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODg1MDY5MDksImV4cCI6MjAwNDA4MjkwOX0.QRZIcRkCTw5U_ZLnDXJOzTodyypP2jaS1X7tPXG8eh4';
const supabase = createClient.createClient(supabaseUrl, supabaseKey);

app.put('/:path', async (req, res) => {
    try {
        const json_path = req.params.path;
        const json = req.body;

        const { error } = await supabase.from('json_documents').insert([{"data": json, "json-path": json_path}]);

        if(error) {
            throw new Error();
        }

        res.status(200).json('Data uploaded');
    } catch (e) {
        res.status(404).json('Cannot insert your data');
    }
});

app.get('/:path', async (req, res) => {
    try {
        const json_path = req.params.path;

        const json = await supabase.from('json_documents').select('data').eq('json-path', json_path);

        res.status(200).json(json.data);
    } catch (e) {
        res.status(404).json("Can't find data");
    }

});

const port = 5000;
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});