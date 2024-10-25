// functions/hello.js
exports.handler = async (event, context) => {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': 'https://kanap-cyan.vercel.app/', // Remplacez '*' par l'URL de votre front-end en production
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS', // Ajoutez les méthodes que vous souhaitez autoriser
        'Access-Control-Allow-Headers': 'Content-Type', // Ajoutez d'autres en-têtes si nécessaire
      },
      body: JSON.stringify({ message: 'Hello from the back-end!' }),
    };
  };
  