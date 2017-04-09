export default Sizes = {};

const sizes = {
  tiny: 2,
  small: 4,
  medium: 6,
  large: 10,
  huge: 16,
};

const text = {
  tiny: '2ch',
  small: '3ch',
  medium: '4ch',
  large: '5ch',
  huge: '6ch',
};

Sizes.get = (size)=>sizes[size];
Sizes.getText = (size)=>text[size];