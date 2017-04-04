export default Colors = {};

const colors = {
  blue: '#2196f3',
  orange: '#ff9800',
  purple: '#9c27b0',
  red: '#f44336',
  green: '#4caf50'
};

Colors.getHex = (color)=>colors[color];