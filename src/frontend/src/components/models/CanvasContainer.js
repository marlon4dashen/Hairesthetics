import React from "react";
import styled from "styled-components";


export const CanvasContainer = styled.div`
    width: 90vw;
    height: 89vh;
    position: relative;
    z-index: 5;

    }
`;

export const TopContainer = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    margin:0;
    top:33vh;
    left:10vw;

    display: flex;
    flex-direction: column;
    align-items: center;
    z-index: 10;
`;