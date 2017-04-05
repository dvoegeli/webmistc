export default Sizes = {};

const sizes = {
  tiny: 2,
  small: 4,
  medium: 6,
  large: 10,
  huge: 16,
};

Sizes.get = (size)=>sizes[size];