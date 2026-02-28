const http = require('http');
http.get('http://localhost:5174/api/projects', res => {
    let body = '';
    res.on('data', d => body += d);
    res.on('end', () => {
        const data = JSON.parse(body).data;
        data.forEach(p => {
            console.log(p.name, p.marqueeCards ? p.marqueeCards.length : 0);
            if (p.marqueeCards && p.marqueeCards.length) console.log(p.marqueeCards.map(c => c.cardType || 'undefined').join(', '));
        });
    });
});
