import React from "react";

export default function Die(props) {
  const styles = {
    backgroundColor: props.isHeld ? "#59E391" : "#FFFFFF"
  }
    return (
      <div className="dice--face" style={styles} onClick={props.holdDice}>
        <h2 className="dice--number">{props.value}</h2>
      </div>
    );
  }