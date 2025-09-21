// Simple App for Vercel testing
console.log('App.js carregado com sucesso!');

// Test if React is available
if (typeof React === 'undefined') {
    console.error('React não está disponível!');
    document.getElementById('root').innerHTML = '<div style="padding: 20px; text-align: center; color: red;"><h1>Erro: React não carregado</h1><p>Verifique se as bibliotecas React estão sendo carregadas corretamente.</p></div>';
} else {
    console.log('React disponível:', React.version);
}

// Simple test component
const TestApp = () => {
    const [message, setMessage] = React.useState('Carregando...');
    
    React.useEffect(() => {
        setMessage('✅ App funcionando no Vercel!');
    }, []);
    
    return React.createElement('div', {
        style: {
            padding: '20px',
            textAlign: 'center',
            fontFamily: 'Arial, sans-serif',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }
    },
        React.createElement('div', {
            style: {
                background: 'rgba(255, 255, 255, 0.1)',
                padding: '40px',
                borderRadius: '15px',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
            }
        },
            React.createElement('h1', {
                style: { fontSize: '2.5em', marginBottom: '20px' }
            }, '🏛️ AppTravel'),
            React.createElement('p', {
                style: { fontSize: '1.2em', marginBottom: '20px' }
            }, message),
            React.createElement('div', {
                style: { marginTop: '20px' }
            },
                React.createElement('a', {
                    href: '/index-simple-vercel.html',
                    style: {
                        background: 'rgba(255, 255, 255, 0.2)',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        color: 'white',
                        padding: '10px 20px',
                        borderRadius: '8px',
                        textDecoration: 'none',
                        display: 'inline-block',
                        margin: '5px'
                    }
                }, 'Teste Simples'),
                React.createElement('a', {
                    href: '/public/Images/ROMA_Coliseu.jpg',
                    target: '_blank',
                    style: {
                        background: 'rgba(255, 255, 255, 0.2)',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        color: 'white',
                        padding: '10px 20px',
                        borderRadius: '8px',
                        textDecoration: 'none',
                        display: 'inline-block',
                        margin: '5px'
                    }
                }, 'Teste Imagem')
            )
        )
    );
};

// Render the app
if (typeof ReactDOM !== 'undefined') {
    ReactDOM.render(React.createElement(TestApp), document.getElementById('root'));
} else {
    console.error('ReactDOM não está disponível!');
    document.getElementById('root').innerHTML = '<div style="padding: 20px; text-align: center; color: red;"><h1>Erro: ReactDOM não carregado</h1><p>Verifique se as bibliotecas React estão sendo carregadas corretamente.</p></div>';
}
