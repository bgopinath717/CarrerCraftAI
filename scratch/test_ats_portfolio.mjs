import fs from 'fs';
import { evaluateATS } from '../server/src/services/atsScoringEngine.js';

const text = fs.readFileSync('scratch/test_upload_resume.txt', 'utf-8');
const ats = evaluateATS({ text, roleId: 'mern-developer' });
console.log('ATS Score:', ats.score);
console.log('Interpretation:', ats.interpretation);
console.log('Recommendations Count:', ats.recommendations.length);
console.log('Sample Recommendation:', JSON.stringify(ats.recommendations[0], null, 2));
