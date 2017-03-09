# postcss-ltr-rtl-detect

[PostCSS](https://github.com/postcss/postcss) plugin that detects properties in your CSS that influence LTR and RTL layouts and are not being generated by @mixins or another dynamic way.

*item.css*
```css
    .item {
        text-align: right;
    }
```

**Console warning:**
>  text-align: right; found on line 2. Use a @mixin to support LTR vs RTL.  

*item.css* - fixing the warnings
```css
    .item {
        /*
        supposing you have a @mixin that handles the alignment "right" or "left"
        following the current layout direction (LTR or RTL)
        */
        @mixin textAlign end;
    }
```

Done!

**Properties detected:**  
`padding`, `padding-right`, `padding-left`  
`margin`, `margin-right`, `margin-left`  
`border`, `border-right`, `border-left`
`left`, `right`  
`text-align`   
`float`  

**Aggressive Properties detected:**  
`padding-top`, `padding-bottom`,
`margin-top`, `margin-bottom`,
`border-top`, `border-bottom`,
`top`, `bottom`,
`border`,



## Usage
All warnings are written to postCSS `result.messages`.  
You'll need a tool to handle them, for example, [postcss-reporter](https://www.npmjs.com/package/postcss-browser-reporter).

```js

    postcss() {
        return [
            require('postcss-ltr-rtl-detect'),
            require('postcss-reporter'),
        ];
    }
```

### Options (all optional)

#### `aggressive`
Detects properties that don't influence layout LTR RTL like "margin-top".  
**Type:** `Bollean`  
**Default:** true

#### `aggressiveMsg`
Warning shown when an *Aggressive Property* is found.  
**Type:** `string`  
**Default:** Use a @mixin to keep consistence on code.

**Example**

*item.css*
```css
    .item {
        @mixin margin end, 1rem;
        margint-top: 10%;
    }
```

**Console warning:**
>  margint-top: 10%; found on line 3. Use a @mixin to keep consistence on code.

---

#### `importantDetect`
Detects properties that have `!important`.  
**Type:** `Bollean`  
**Default:** false

#### `importantMsg`
Warning shown when a unit value is found (`unitsDetect: true` required).  
**Type:** `string`  
**Default:** Consider reviewing your code and remove !important rule.

**Example**

*item.css*
```css
    .item {
        margint-top: 10%!important;
    }
```

**Console warning:**
>  margint-top: 10%!important; found on line 2. Consider reviewing your code and remove !important rule...

---

#### `propsMsg`
Warning shown when a propriety that affects the layout RTL vs LTR is found.  
**Type:** `string`  
**Default:** Use a @mixin to support LTR vs RTL.

#### `unitsPxDetect`
Detects properties that have `px` value instead of variable.  
**Type:** `Bollean`  
**Default:** false


#### `unitsRemDetect`
Detects properties that have `rem` value instead of variable.  
**Type:** `Bollean`  
**Default:** false

#### `unitsEmDetect`
Detects properties that have `em` value instead of variable.  
**Type:** `Bollean`  
**Default:** false

#### `unitsMsg`
Warning shown when a unit value is found (`unitsDetect: true` required).  
**Type:** `string`  
**Default:** Consider using a variable.

**Example**

*item.css*
```css
    .item {
    	border: 1px solid red;
        padding: 15px;
        font-size: 1rem;
    }
```

**Console warning:**
>  font-size: 10px; found on line 2. Consider using a variable.
>  padding: 15px; found on line 3. Consider using a variable.
>  font-size: 1rem; found on line 4. Consider using a variable.

---




### Usage example with some options

```js

    /* activate units detection */
    postcss() {
        return [
            require('postcss-ltr-rtl-detect')({
                importantDetect: true,
                importantMsg: "don't you dare using it",
                unitsPxDetect: true
            }),
            require('postcss-reporter'),
        ];
    }

```


## Contribute
Any doubts or suggestions you may have feel free to create an issue on [github repo](https://github.com/sandrina-p/postcss-ltr-rtl-detect).


## License
MIT Licence
