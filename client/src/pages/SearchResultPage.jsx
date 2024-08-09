/* SearchResultPage.jsx
검색 결과를 보여주는 페이지입니다.
useLocation 훅을 사용하여 데이터를 useState로 상태관리 후 props로 넘겨 매번 API를 재요청하지 않고 사용합니다.
*/

import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';


const API_URL = import.meta.env.VITE_HOST_IP;

function SearchResultPage() {
  const [results, setResults] = useState([]);   // 검색 결과 저장
  const [isLoading, setIsLoading] = useState(false);    // 검색 후 로딩
  const [error, setError] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const query = searchParams.get('q');
    const category = searchParams.get('category') || 'all'

    console.log(query)
    console.log(category)
    if (query) {
      fetchSearchResults(query,category);
    }
  }, [location]);


  // fetch 함수
  const fetchSearchResults = async (query,category) => {
    setIsLoading(true);   
    setError(null)

    try {
      const response = await fetch(`${API_URL}/api/search?q=${encodeURIComponent(query)}&category=${encodeURIComponent(category)}`, {    // 검색어 내 공백이나 특수문자 인코딩하여 가져옴
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );
      if (!response.ok) {
        throw new Error(`검색 요청에 실패했습니다.: ${response.status}`);
      }
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error('검색 중 오류 발생:', error.message);
      setError('검색 중 오류가 발생했습니다. 다시 시도해 주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  // Search Result 문구 표시
  if (!results) {
    return;
  }
  
  if (isLoading) {    // 검색 로딩중
    return <p>검색 중...</p>;
  }

  if (error) {      // 검색 오류
    return <p className="error-message">{error}</p>;
  }

  if (results.length === 0) {    // 해당 검색 결과가 없을 때
    return <p>검색 결과가 없습니다.</p>;
  }



  return (
    <Container>
      <h3>검색 결과</h3>
      <Row lg={5} className="g-4">
        {results.map((recipe) => (    // results 배열에 저장된 검색결과를 사용
          <Col key={recipe.recipe_id}>  
            <Link to={`/recipe/${recipe.recipe_id}`} style={{ textDecoration: 'none' }}>
              <Card style={{ cursor: 'pointer' }}>
                <Card.Img variant="top" src={recipe.recipe_img} />
                <Card.Body>
                  <Card.Title>
                    {recipe.recipe_name}
                  </Card.Title>
                  <Button variant="dark">보러가기</Button>
                </Card.Body>
              </Card>
            </Link>
          </Col>
        ))}
      </Row>
    </Container>
  );
}


export default SearchResultPage;