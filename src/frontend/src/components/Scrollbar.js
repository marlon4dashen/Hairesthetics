import React from "react";
import map from "lodash/map";
import range from "lodash/range";
import short from "../../public/assets/hairstyles/short.jpg"
import Card from 'react-bootstrap/Card';

export default function Scrollbar(props) {
  return (
      <div style={{ width: "100%", overflow: "auto", display: "flex" }}>
        {map(range(10), _ => (
            <Card className = "rect-img-container" >
              <Card.Img className = 'rect-img' variant="top" src={short} />
              <Card.Body>
                <Card.Title>Hairstyle</Card.Title>
                <Card.Text>
                </Card.Text>
              </Card.Body>
            </Card>
        ))}
      </div>
  );
}

