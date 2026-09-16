import useSWRInfinite from 'swr/infinite';

const PAGE_SIZE = 12;

const fetchNewsForPaths = async (paths, offset) => {
  try {
    const fetchPromises = paths.map(path =>
      fetch(`/api/espn?url=${encodeURIComponent(`https://now.core.api.espn.com/v1/sports/soccer/${path}/news?limit=${PAGE_SIZE}&offset=${offset}`)}`)
        .then(res => res.json())
        .then(data => data.headlines || [])
        .catch(() => [])
    );
    
    // Add global soccer news to ensure high volume
    fetchPromises.push(
      fetch(`/api/espn?url=${encodeURIComponent(`https://now.core.api.espn.com/v1/sports/soccer/news?limit=${PAGE_SIZE}&offset=${offset}`)}`)
        .then(res => res.json())
        .then(data => data.headlines || [])
        .catch(() => [])
    );

    const results = await Promise.all(fetchPromises);

    const allArticles = results.flat();
    const uniqueArticles = Array.from(new Map(allArticles.map(item => [item.headline, item])).values());

    uniqueArticles.sort((a, b) => new Date(b.published).getTime() - new Date(a.published).getTime());

    return uniqueArticles.map(article => ({
      id: article.id || article.headline,
      headline: article.headline,
      description: article.description,
      image: article.images && article.images.length > 0 ? article.images[0].url : null,
      link: article.links?.web?.href || '#',
      published: article.published,
      categories: article.categories
    }));
  } catch (err) {
    console.error("Error fetching news:", err);
    return [];
  }
};

export function useNews(leaguePaths = ['eng.1', 'esp.1', 'ger.1', 'ita.1']) {
  const paths = Array.isArray(leaguePaths) ? leaguePaths : [leaguePaths];
  
  const getKey = (pageIndex, previousPageData) => {
    if (previousPageData && !previousPageData.length) return null; // reached the end
    return `news-${paths.join('-')}-page-${pageIndex}`;
  };

  const { data, error, isLoading, size, setSize, isValidating } = useSWRInfinite(
    getKey,
    (key) => {
      const pageIndex = parseInt(key.split('-page-')[1]);
      const offset = pageIndex * PAGE_SIZE;
      return fetchNewsForPaths(paths, offset);
    },
    {
      revalidateOnFocus: true,
      revalidateFirstPage: false,
      keepPreviousData: true
    }
  );

  const news = data ? data.flat() : [];
  const uniqueNews = Array.from(new Map(news.map(item => [item.headline, item])).values());
  uniqueNews.sort((a, b) => new Date(b.published).getTime() - new Date(a.published).getTime());

  return {
    news: uniqueNews,
    loading: isLoading,
    loadingMore: isValidating && data && typeof data[size - 1] !== "undefined",
    loadMore: () => setSize(size + 1),
    hasMore: data && data[data.length - 1]?.length > 0
  };
}
