const http = require('http');
http.get('http://localhost:5000/api/projects', res => {
    let body = '';
    res.on('data', d => body += d);
    res.on('end', () => {
        try {
            const data = JSON.parse(body).data;
            data.forEach(p => {
                console.log(p.name, p.marqueeCards ? p.marqueeCards.length : 0);
                if (p.marqueeCards && p.marqueeCards.length) console.log(p.marqueeCards.map(c => c.cardType || 'undefined').join(', '));
            });
        } catch (err) { console.error('Error parsing:', body.slice(0, 100)) }
    });
});
