import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import Alert from "react-bootstrap/Alert";
import { Button } from "react-bootstrap";
import Card from "react-bootstrap/Card";
import { Link } from "react-router-dom";

const CardContainer = styled.div`
  margin-top: 3rem;
  margin-bottom: 3rem;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 3rem;

  @media (max-width: 749px) {
    justify-content: center;
  }
`;

const Heading = styled.h1`
  font-family: "Times New Roman", Times, serif;
  font-weight: bold;
  font-size: 32px;
  line-height: 46px;
  text-align: center;
  color: #3944d7;
  margin: 40px 20px;
`;

const SearchTextInput = styled.input`
  border: 1px solid;
  margin-top: 5px;
  border-radius: 5px;
  font-size: 16px;
  height: 35px;
  width: 100%;
  padding: 10px 20px;
  outline: none;
  line-height: 22px;
  :hover {
    border: 2px solid #3944d7;
  }
`;

const TextFielsContainer = styled.div`
  margin-top: 32px;
  display: flex;
  justify-content: space-between;
  @media (max-width: 749px) {
    margin: 32px 27px 16px 27px;
    flex-direction: column;
  }
`;

const CardImage = styled(Card.Img)`
  width: 100%;
  height: 18rem;
  object-fit: cover;
`;

const ErrorsContainer = styled.div`
  margin-top: 20px;
  margin-bottom: 20px;
`;

const SearchButton = styled(Button)`
  margin-top: 20px;
  @media (max-width: 749px) {
    margin-left: 27px;
  }
`;

const LoaderWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

const Loader = styled.div`
  border: 8px solid #f3f3f3;
  border-top: 8px solid #3498db;
  border-radius: 50%;
  width: 80px;
  height: 80px;
  animation: ${spin} 2s linear infinite;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
`;

const Search = () => {
  const [query, setQuery] = useState("");
  const [yearStart, setYearStart] = useState("");
  const [yearEnd, setYearEnd] = useState("");
  const [results, setResults] = useState([]);
  const [show, setShow] = useState(true);
  const [responseError, setResponseError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [uniqueImages, setUniqueImages] = useState([]);

  const clearInputFields = () => {
    setQuery("");
    setYearEnd("");
    setYearStart("");
  };

  const getUniqueImages = (items) => {
    const images = items.map((item) => item?.links[0]?.href);
    const uniqueLinks = [...new Set(images)];
    setUniqueImages(uniqueLinks);
  };

  const updateResults = async (response) => {
    switch (response.status) {
      case 200: {
        const data = await response.json();
        const { items } = data.collection;
        getUniqueImages(items);
        if (items.length === 0) {
          setResponseError(
            "No data available for this search! Reset Your Search"
          );
          setShow(true);
        }
        setResults(items);
        clearInputFields();
        break;
      }
      case 400:
        setResponseError(
          "The request was unacceptable, often due to invalid parameters."
        );
        setShow(true);
        setResults([]);
        break;
      case 404:
        setResponseError("The requested resource doesn’t exist.");
        setShow(true);
        setResults([]);
        break;
      case 500:
      case 502:
      case 503:
      case 504:
        setResponseError("Internal Server Error");
        setShow(true);
        setResults([]);
        break;
      default:
        setResponseError("Something went wrong. Please try again later");
        setShow(true);
        setResults([]);
    }
  };

  const handleSearch = async () => {
    try {
      setShow(false);
      setIsLoading(true);
      const response = await fetch(
        `https://images-api.nasa.gov/search?q=${encodeURIComponent(query)}${
          yearStart ? `&year_start=${yearStart}` : ""
        }${yearEnd ? `&year_end=${yearEnd}` : ""}&media_type=image`
      );
      await updateResults(response);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <Heading>Search NASA Media Library</Heading>
      {responseError && show && (
        <ErrorsContainer>
          <Alert variant="danger" onClose={() => setShow(false)} dismissible>
            <Alert.Heading>{responseError}</Alert.Heading>
          </Alert>
        </ErrorsContainer>
      )}
      <TextFielsContainer>
        <label>
          Query:<span style={{color: "#FF0000"}}>*</span>
          <SearchTextInput
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
        <label>
          Start Year:
          <SearchTextInput
            type="text"
            value={yearStart}
            onChange={(e) => setYearStart(e.target.value)}
          />
        </label>
        <label>
          End Year:
          <SearchTextInput
            type="text"
            value={yearEnd}
            onChange={(e) => setYearEnd(e.target.value)}
          />
        </label>
      </TextFielsContainer>
      <SearchButton disabled={!query} onClick={handleSearch}>
        Search
      </SearchButton>
      {isLoading ? (
        <LoaderWrapper>
          <Loader />
        </LoaderWrapper>
      ) : (
        <CardContainer>
          {results.map((result) => (
            <Card style={{ width: "18rem" }} key={result?.data[0]?.nasa_id}>
              <StyledLink to="/detail" state={{ result, uniqueImages }}>
                <CardImage
                  variant="top"
                  src={result?.links[0]?.href}
                  alt={result?.data[0]?.title}
                  loading="lazy"
                />
              </StyledLink>
              <Card.Body>
                <Card.Title>
                  {result?.data[0]?.title?.substring(0, 50)}
                </Card.Title>
                {result?.data[0]?.location && (
                  <Card.Text>Location: {result?.data[0]?.location} </Card.Text>
                )}
                {result.data[0].photographer && (
                  <Card.Text>
                    Photographer: {result?.data[0]?.photographer}
                  </Card.Text>
                )}
              </Card.Body>
            </Card>
          ))}
        </CardContainer>
      )}
    </div>
  );
};

export default Search;
