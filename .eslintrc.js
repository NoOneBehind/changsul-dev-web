module.exports = {
  "env": {
    "browser": true,
    "es2020": true,
  },
  "extends": ["airbnb", "airbnb/hooks"],
  "rules": {
    "react/jsx-filename-extension": [1, { "extensions": ["js", "jsx"] }],
    "import/prefer-default-export": ["off"],
    "react-hooks/exhaustive-deps": ["warn"],
    "react/jsx-props-no-spreading": ["warn"],
  },
  "settings": {
    "import/resolver": {
      "node": {
        "moduleDirectory": ["node_modules", "."]
      }
    }
  }
};
