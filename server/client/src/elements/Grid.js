import React from 'react'
import styled from 'styled-components'

const Grid = (props) => {
  const { position, children, flex, align, width, padding, margin, _onClick, bg, height, overflowY, verticalAlign, alignItems, maxWidth, flexDirection, justifyContent, borderBottom, gap, overflowX } =
    props
  const styles = {
    flex: flex,
    position: position,
    width: width,
    height: height,
    padding: padding,
    margin: margin,
    align: align,
    bg: bg,

    overflowY: overflowY,
    verticalAlign: verticalAlign,
    alignItems: alignItems,
    maxWidth: maxWidth,
    flexDirection: flexDirection,
    justifyContent: justifyContent,
    borderBottom: borderBottom,
    gap: gap,
    overflowX: overflowX,
  }

  return (
    <GridBox {...styles}>
      {children}
    </GridBox>
  )
}

Grid.defaultProps = {
  position: false,
  children: null,
  flex: false,
  width: '100%',
  height: 'false',
  padding: false,
  margin: false,
  align: false,
  bg: false,
  overflowY: false,
  verticalAlign: false,
  alignItems: false,
  maxWidth: '',
  flexDirection: false,
  justifyContent: false,
  borderBottom: false,
  gap: false,
  overflowX: false,
}

const GridBox = styled.div`
  position: ${(props) => (props.position ? `${props.position}` : '')};
  width: ${(props) => props.width};
  height: ${(props) => props.height};
  box-sizing: border-box;
  padding: ${(props) => (props.padding ? `${props.padding}` : '')};
  margin: ${(props) => (props.margin ? `${props.margin}` : '')};
  display: ${(props) => (props.flex ? `${props.flex}` : '')};
  text-align: ${(props) => props.align};
  background: ${(props) => props.bg};
  overflow-y: ${(props) => props.overflowY};
  vertical-align: ${(props) => (props.verticalAlign ? `${props.verticalAlign};` : '')};
  align-items: ${(props) => (props.alignItems ? `${props.alignItems};` : '')};
  max-width: ${(props) => (props.maxWidth ? `${props.maxWidth};` : '')};
  flex-direction: ${(props) => (props.flexDirection ? `${props.flexDirection};` : '')};
  justify-content: ${(props) => (props.justifyContent ? `${props.justifyContent};` : '')};
  border-bottom: ${(props) => (props.borderBottom ? `${props.borderBottom};` : '')};
  gap: ${(props) => (props.gap ? `${props.gap};` : '')};
  overflow-x: ${(props) => props.overflowX};
`

export default Grid;
