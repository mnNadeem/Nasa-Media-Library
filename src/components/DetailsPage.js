import React from "react";
import { Button } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import styled from "styled-components";

const Conatiner = styled.div`
  display: flex;
  margin-top: 100px;
  justify-content: center;
  @media (max-width: 700px) {
    margin-top: 50px;
    flex-direction: column;
  }
`;

const LeftContainer = styled.div`
  display: flex;
  @media (max-width: 700px) {
    flex-direction: column;
    align-items: center;
  }
`;

const RightContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 500px;
  @media (max-width: 700px) {
    align-self: center;
    margin-top: 20px;
    width: 300px;
  }
`;

const StyledImage = styled.img`
  width: 300px;
  height: 280px;
  margin-right: 32px;
  @media (max-width: 700px) {
    margin-right: 0px;
  }
`;

const Description = styled.div`
  width: 500px;
  height: 300px;
  margin-right: 38px;
  overflow-y: auto;
  @media (max-width: 700px) {
    width: 300px;
    height: 99px;
    margin-left: 0px;
    margin-right: 0px;
    overflow-y: scroll;
    margin-top: 20px;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 30px;
  @media (max-width: 700px) {
    margin-bottom: 30px;
  }
`;

const DetailsPage = () => {
  const {
    state: { result, uniqueImages },
  } = useLocation();
  const {
    data: [
      { title, description, photographer, location, keywords, date_created },
    ],
    links: [{ href }],
  } = result;

  return (
    <>
      <Conatiner>
        <LeftContainer>
          <StyledImage src={href} alt={title} />
          <Description>
            <b>Description:</b> {description}
          </Description>
        </LeftContainer>
        <RightContainer>
          {title && (
            <p>
              <b>Title:</b> {title}
            </p>
          )}
          {photographer && (
            <p>
              <b>Photographer:</b> {photographer}
            </p>
          )}
          {location && (
            <p>
              <b>Location:</b> {location}
            </p>
          )}
          {keywords && (
            <p>
              <b>Keywords:</b> {keywords.join(" | ")}
            </p>
          )}
          <p>
            <b>Date:</b> {new Date(date_created).toLocaleDateString()}
          </p>
        </RightContainer>
      </Conatiner>
      <ButtonContainer>
        <Link to="/">
          <Button>Go Back to Search Page</Button>
        </Link>
      </ButtonContainer>
    </>
  );
};

export default DetailsPage;
