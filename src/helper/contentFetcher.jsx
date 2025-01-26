const cache = new Map();

export const fetchContent = async (url) => {
    if (cache.has(url)) {
        return cache.get(url);
    }

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        cache.set(url, data);
        return data;
    } catch (error) {
        console.error('Error fetching content:', error);
        throw error;
    }
};