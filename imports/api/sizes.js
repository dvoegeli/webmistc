export default Sizes = {};

const sizes = {
  tiny: 2,
  small: 4,
  medium: 6,
  large: 10,
  huge: 16,
};

const text = {
  tiny: '1ch',
  small: '2ch',
  medium: '3ch',
  large: '4ch',
  huge: '5ch',
};

Sizes.get = (size)=>sizes[size];
Sizes.getText = (size)=>text[size];