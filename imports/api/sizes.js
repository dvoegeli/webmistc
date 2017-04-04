export default Sizes = {};

const sizes = {
  tiny: 1,
  small: 3,
  medium: 6,
  large: 10,
  huge: 16,
};

Sizes.getHex = (size)=>sizes[size];