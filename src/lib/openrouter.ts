interface OpenRouterResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

export const getAddressInfo = async (address: string): Promise<string> => {
  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer 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',
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin,
        'X-Title': 'AdresseParcelle'
      },
      body: JSON.stringify({
        model: 'deepseek/deepseek-chat-v3-0324:free',
        messages: [
          {
            role: 'user',
            content: `Que peux tu me dire sur cette adresse : ${address}

Peux-tu me fournir des informations détaillées sur cette adresse, notamment :
- Le quartier et ses caractéristiques
- Les commodités à proximité (commerces, écoles, transports)
- L'environnement et l'ambiance du secteur
- Les points d'intérêt dans les environs
- Toute information utile pour quelqu'un qui souhaiterait habiter dans cette zone
Merci de structurer ta réponse de manière claire et informative en français.
Ne propose pas en conclusion d'avoir plus d'information, le résultat est juste informatif`
          }
        ],
        max_tokens: 1500,
        temperature: 0.7,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenRouter API Error:', response.status, errorData);
      throw new Error(`Erreur API OpenRouter: ${response.status}`);
    }

    const data: OpenRouterResponse = await response.json();
    
    if (!data.choices || data.choices.length === 0) {
      throw new Error('Aucune réponse reçue de l\'API');
    }

    const content = data.choices[0]?.message?.content;
    
    if (!content) {
      throw new Error('Contenu de réponse vide');
    }

    return content;
  } catch (error) {
    console.error('Erreur lors de la requête OpenRouter:', error);
    
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      throw new Error('Impossible de se connecter au service d\'information. Vérifiez votre connexion internet.');
    }
    
    if (error instanceof Error) {
      throw error;
    }
    
    throw new Error('Une erreur inattendue s\'est produite lors de la récupération des informations.');
  }
};