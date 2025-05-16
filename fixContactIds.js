const fs = require('fs');

// Path to your db.json file
const filePath = './data/db.json';

fs.readFile(filePath, 'utf8', (err, data) => {
  if (err) return console.error('Error reading file:', err);

  try {
    const json = JSON.parse(data);

    // Fix contactId values
    json.messages = json.messages.map(msg => {
      if (msg.contactId !== null && typeof msg.contactId !== 'string') {
        return { ...msg, contactId: String(msg.contactId) };
      }
      return msg;
    });

    // Sort messages by time or timestamp
    json.messages.sort((a, b) => {
      const getTime = (msg) =>
        msg.timestamp
          ? new Date(msg.timestamp).getTime()
          : parseTimeToMs(msg.time || '00:00');
      return getTime(a) - getTime(b);
    });

    fs.writeFile(filePath, JSON.stringify(json, null, 2), 'utf8', err => {
      if (err) return console.error('Error writing file:', err);
      console.log('✅ contactId fixed and messages sorted chronologically!');
    });
  } catch (parseErr) {
    console.error('Error parsing JSON:', parseErr);
  }
});

// Helper to parse "HH:mm" time strings into milliseconds
function parseTimeToMs(timeStr) {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 * 60 * 1000 + minutes * 60 * 1000;
}
