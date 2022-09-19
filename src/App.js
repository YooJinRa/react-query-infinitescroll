import { useEffect } from "react";
import { useInfiniteQuery } from "react-query";
import { useInView } from "react-intersection-observer";

const fetchRepositories = async (page = 1) => {
  const response = await fetch(`https://api.github.com/search/repositories?q=topic:reactjs&per_page=30=page=${page}`);
  return response.json();

  // const { posts, isLast } = res.data;
  // return { posts, nextPage: pageParam + 1, isLast };
}
function App() {
  const { ref, inView } = useInView();
  const { data, status, fetchNextPage, isFetchingNextPage } = useInfiniteQuery("repositories",
    ({ pageParam = 1 }) => fetchRepositories(pageParam), {
    getNextPageParam: (lastPage, allPages) => {
      const maxPages = lastPage.total_count / 30; // 총 페이지수
      const nextPage = allPages.length + 1; // 다음 페이지
      return nextPage <= maxPages ? nextPage : undefined;

      // !lastPage.isLast ? lastPage.nextPage : undefined,

    }
  });

  useEffect(() => {

    if (inView) fetchNextPage();

  }, [inView]);

  if (status === "loading") return <div>Loading!!!</div>;
  if (status === "error") return <div>error!!!</div>;

  console.log(data);
  return (
    <main>
      <h1>Infinite Scroll</h1>
      <ul>
        {
          data?.pages.map((page) => (
            page.items.map((repo) => (
              <li key={repo.id}>
                <p><b>{repo.name}</b></p>
                <p>{repo.description}</p>
              </li>
            ))
          ))
        }
      </ul>
      {isFetchingNextPage ? <div>Loading!!!!!!!!</div> : <div ref={ref}></div>}
    </main>
  );
}

export default App;
