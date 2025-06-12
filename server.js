const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.post('/upload', upload.single('website'), (req, res) => {
    const zipPath = req.file.path;
    const outputDir = path.join(__dirname, 'output', req.file.originalname);

    // Unzip the uploaded file
    exec(`unzip ${zipPath} -d ${outputDir}`, (err, stdout, stderr) => {
        if (err) {
            return res.status(500).send('Error unzipping file');
        }

        // Copy the unzipped files to the Android template's assets directory
        const assetsDir = path.join(__dirname, 'template', 'app', 'src', 'main', 'assets');
        fs.copyFileSync(zipPath, assetsDir);

        // Build the APK using Gradle
        exec('gradle build', { cwd: 'template' }, (err, stdout, stderr) => {
            if (err) {
                return res.status(500).send('Error building APK');
            }

            res.send('APK created successfully!');
        });
    });
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
