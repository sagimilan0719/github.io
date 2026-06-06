// storing debug log information
var debugTable = [];

/**
  * resizes container's text's font according
  * to the size of the container
  *
  * @param {string} selector - Used to retrieve element from document
  * @param {object} options {
  *   {integer} minFontSize Minimum font size the text can have
  *   {integer} maxFontSize Maximum font size the text can have
  *   {boolean} wordWrap Should word wrap be used or not
  *   {boolean} resizer Should the resizer run or just exit
  *   {integer} timeout How much to delay before starting resizer
  *   {integer} resize How many times should the resizer run
  *   {integer} maxProbs The amount of times it can resize a text
  *   {boolean} debug If set debug mode to true, write logs to console
  * } - Custom options of the resizer
  *
  * @returns {void}
  */

function resizer(selector, { minFontSize = 12, maxFontSize = 96, checkWidth = false, checkHeight = false, wordWrap = false, resizer = true, timeout = 100, resize = 1, maxProbs = 300, debug = false } = {}) {
  try {

    document.addEventListener("readystatechange", (event) => {

      var container = document.querySelectorAll(selector)[0];

      if (document.readyState !== 'complete' && !container) {
        console.log("Page is not loaded yet");
        return;
      }

      setTimeout(function() {
        if ((typeof resizer === "boolean" ? resizer != true : resizer != 'true') || !resizer) {
          return;
        }

        var container = document.querySelectorAll(selector)[0];
        var text = container.firstElementChild;

        if (!container || container.innerText == "" || !text || text.innerText == "") {
          return;
        }

        debugTable.push({
          message: "Start of script",
          function: "resizer"
        });
        debugTable.push({
          message: container,
          function: "resizer"
        });
        debugTable.push({
          message: text,
          function: "resizer"
        });
        debugTable.push({
          message: `Before resize Container height: ${container.offsetHeight}`,
          function: "resizer"
        });
        debugTable.push({
          message: `Before resize Text height: ${text.scrollHeight}`,
          function: "resizer"
        });
        debugTable.push({
          message: `Before resize Container width: ${container.offsetWidth}`,
          function: "resizer"
        });
        debugTable.push({
          message: `Before resize Text width: ${text.scrollWidth}`,
          function: "resizer"
        });

        text.style = '';

        if (wordWrap) {
          text.style['word-wrap'] = 'normal';
        } else {
          text.style['white-space'] = 'nowrap';
        }

        // initialize resizer instance
        var resizerInstance = new Resizer();
        resizerInstance.container = container;
        resizerInstance.text = text;
        resizerInstance.minFontSize = minFontSize;
        resizerInstance.maxFontSize = maxFontSize;
        resizerInstance.wordWrap = wordWrap;
        resizerInstance.checkWidth = checkWidth;
        resizerInstance.checkHeight = checkHeight;
        resizerInstance.maxProbs = maxProbs;

        for (var i = 0; i < resize; i++) {

          debugTable.push({
            message: "Running resizer",
            function: "resizer"
          });

          resizerInstance.resizeToFit();
        }

        var container = document.querySelectorAll(selector)[0];
        var text = container.firstElementChild;
        var fontSize = window.getComputedStyle(text).fontSize;

        // finalizing the font size if text size reached the container's bounds
        if (text.scrollHeight >= container.offsetHeight || text.scrollWidth >= container.offsetWidth) {
          resizerInstance.fontSize = fontSize;
          resizerInstance.decreaseFontSize();
        }

        debugTable.push({
          message: `Final font size: ${fontSize}`,
          function: "resizer"
        });
        debugTable.push({
          message: `After resize Container height: ${container.offsetHeight}`,
          function: "resizer"
        });
        debugTable.push({
          message: `After resize Text height: ${text.scrollHeight}`,
          function: "resizer"
        });
        debugTable.push({
          message: `After resize Container width: ${container.offsetWidth}`,
          function: "resizer"
        });
        debugTable.push({
          message: `After resize Text width: ${text.scrollWidth}`,
          function: "resizer"
        });
        debugTable.push({
          message: container,
          function: "resizer"
        });
        debugTable.push({
          message: text,
          function: "resizer"
        });
        debugTable.push({
          message: "End of script",
          function: "resizer"
        });

        if (debug) {
          console.table(debugTable);
        }

        debugTable = [];
      }, timeout);
    });

  } catch (error) {
    console.error("Error in font resizer:", error);
  }
}

/**
 * @class
 *
 * @param {object} container HTML DOM element that contains the text
 * @param {object} text HTML DOM element that is the text in the container
 * @param {integer} minFontSize Minimum font size
 * @param {integer} maxFontSize Maximum font size
 * @param {boolean} wordWrap Should word wrap be used
 * @param {boolean} checkWidth Checks width either way, even if wordWrap is used
 * @param {boolean} checkHeight Checks height either way, even if wordWrap is not used
 * @param {integer} maxProbs The maximum number of probes
 * @param {integer} probs The current number of probes
 * @param {integer} fontSize Current font size of the text
 *
 */
var Resizer = class {
  container;

  text;

  minFontSize;

  maxFontSize;

  wordWrap;

  checkWidth;

  checkHeight;

  maxProbs;

  probs;

  fontSize;

  constructor(container, text, minFontSize, maxFontSize, wordWrap, checkWidth, checkHeight, maxProbs) {
    this.container = container;
    this.text = text;
    this.minFontSize = minFontSize;
    this.maxFontSize = maxFontSize;
    this.wordWrap = wordWrap;
    this.checkWidth = checkWidth;
    this.checkHeight = checkHeight;
    this.maxProbs = maxProbs;
    this.probs = 0;
  }

  /**
    * decides if the resizing process
    * should be started by checking the
    * height of the container and text
    *
    * @returns {void}
    */
  resizeToFit() {
    if (this.text.offsetHeight == 0 || this.container.offsetHeight == 0) {
      debugTable.push({
        message: "Nothing to resize",
        function: "resizeToFit"
      });
      return;
    }

    this.resizeFont();

    if (this.probs >= this.maxProbs) {
      debugTable.push({
        message: "Reached maximum probation number",
        function: "resizeToFit"
      });
      return;
    }

    if (this.checkWidth && !this.checkHeight) {
      this.resizeToWidth();
    }

    if (this.checkHeight && !this.checkWidth) {
      this.resizeToHeight();
    }

    if (this.checkWidth && this.checkHeight) {
      this.resizeToContainer();
    }
  }

  /**
    * increases size of the font of the text
    *
    * @returns {void}
    */
  increaseFontSize() {
    this.text.style.fontSize = parseFloat(this.fontSize) + 1 + "px";
    this.fontSize = window.getComputedStyle(this.text).fontSize;
    this.probs++;
  }

  /**
    * decreases size of the font of the text
    *
    * @returns {void}
    */
  decreaseFontSize() {
    this.text.style.fontSize = parseFloat(this.fontSize) - 1 + "px";
    this.fontSize = window.getComputedStyle(this.text).fontSize;
    this.probs++;
  }

  /**
    * decides how and when to decrease or increase the size of the font
    * by checking if word wrap is used and if the text font size
    * reached either the minimum font size or the maximum font size
    *
    * @returns {void}
    */
  resizeFont() {
    this.fontSize = window.getComputedStyle(this.text).fontSize;

    if (this.fontSize < this.minFontSize) {
      debugTable.push({
        message: "Increasing font size because it is smaller than min font size!",
        function: "resizeFont"
      });
      this.makeFontSizeBigger();
      return;
    }

    if (this.fontSize > this.maxFontSize) {
      debugTable.push({
        message: "Reducing font size because it is bigger than max font size!",
        function: "resizeFont"
      });
      this.makeFontSizeSmaller();
      return;
    }

    if (this.text.scrollHeight < this.container.offsetHeight && this.wordWrap) {
      debugTable.push({
        message: "Increasing font size!",
        function: "resizeFont"
      });
      this.makeFontSizeBigger();
      return;
    }

    if (this.text.scrollHeight >= this.container.offsetHeight && this.wordWrap) {
      debugTable.push({
        message: "Reducing font size!",
        function: "resizeFont"
      });
      this.makeFontSizeSmaller();
      return;
    }

    if (this.text.scrollWidth < this.container.offsetWidth && !this.wordWrap) {
      debugTable.push({
        message: "Increasing font size!",
        function: "resizeFont"
      });
      this.makeFontSizeBigger();
      return;
    }

    if (this.text.scrollWidth >= this.container.offsetWidth && !this.wordWrap) {
      debugTable.push({
        message: "Reducing font size!",
        function: "resizeFont"
      });
      this.makeFontSizeSmaller();
      return;
    }
  }

  /**
    * decides how and when to decrease or increase the size of the font
    * by checking the width of container and text and if the text font size
    * reached either the minimum font size or the maximum font size
    *
    * @returns {void}
    */
  resizeToWidth() {
    this.fontSize = window.getComputedStyle(this.text).fontSize;

    if (this.fontSize < this.minFontSize) {
      debugTable.push({
        message: "Increasing font size because it is smaller than min font size!",
        function: "resizeToWidth"
      });
      this.makeFontSizeBigger(1);
      return;
    }

    if (this.fontSize > this.maxFontSize) {
      debugTable.push({
        message: "Reducing font size because it is bigger than max font size!",
        function: "resizeToWidth"
      });
      this.makeFontSizeSmaller(1);
      return;
    }

    if (this.text.scrollWidth < this.container.offsetWidth) {
      debugTable.push({
        message: "Increasing font size!",
        function: "resizeToWidth"
      });
      this.makeFontSizeBigger(1);
      return;
    }

    if (this.text.scrollWidth >= this.container.offsetWidth) {
      debugTable.push({
        message: "Reducing font size!",
        function: "resizeToWidth"
      });
      this.makeFontSizeSmaller(1);
      return;
    }
  }

  /**
    * decides how and when to decrease or increase the size of the font
    * by checking the height of container and text and if the text font size
    * reached either the minimum font size or the maximum font size
    *
    * @returns {void}
    */
  resizeToHeight() {
    this.fontSize = window.getComputedStyle(this.text).fontSize;

    if (this.fontSize < this.minFontSize) {
      debugTable.push({
        message: "Increasing font size because it is smaller than min font size!",
        function: "resizeToHeight"
      });
      this.makeFontSizeBigger(0);
      return;
    }

    if (this.fontSize > this.maxFontSize) {
      debugTable.push({
        message: "Reducing font size because it is bigger than max font size!",
        function: "resizeToHeight"
      });
      this.makeFontSizeSmaller(0);
      return;
    }

    if (this.text.scrollHeight < this.container.offsetHeight) {
      debugTable.push({
        message: "Increasing font size!",
        function: "resizeToHeight"
      });
      this.makeFontSizeBigger(0);
      return;
    }

    if (this.text.scrollHeight >= this.container.offsetHeight) {
      debugTable.push({
        message: "Reducing font size!",
        function: "resizeToHeight"
      });
      this.makeFontSizeSmaller(0);
      return;
    }
  }

  /**
    * decides how and when to decrease or increase the size of the font
    * by checking the height and width of container and text and if the text font size
    * reached either the minimum font size or the maximum font size
    *
    * @returns {void}
    */
  resizeToContainer() {
    this.fontSize = window.getComputedStyle(this.text).fontSize;

    if (this.fontSize < this.minFontSize) {
      debugTable.push({
        message: "Increasing font size because it is smaller than min font size!",
        function: "resizeToContainer"
      });
      this.makeFontSizeBigger();
      return;
    }

    if (this.fontSize > this.maxFontSize) {
      debugTable.push({
        message: "Reducing font size because it is bigger than max font size!",
        function: "resizeToContainer"
      });
      this.makeFontSizeSmaller();
      return;
    }

    if (this.text.scrollHeight < this.container.offsetHeight && this.text.scrollWidth < this.container.offsetWidth) {
      debugTable.push({
        message: "Increasing font size!",
        function: "resizeToContainer"
      });
      this.makeFontSizeBigger();
      return;
    }

    if (this.text.scrollHeight >= this.container.offsetHeight && this.text.scrollWidth >= this.container.offsetWidth) {
      debugTable.push({
        message: "Reducing font size!",
        function: "resizeToContainer"
      });
      this.makeFontSizeSmaller();
      return;
    }
  }

  /**
    * increases font size as long as it doesn't reach
    * the maximum font size or the edge of the container
    * or the height of the container depending on the word wrap
    *
    * @param {integer} mode 0 = no word wrap (width), 1 = word wrap (height), 2 = check container boundries (width, height)
    *
    * @returns {void}
    */
  makeFontSizeBigger(mode = 2) {
    if (this.probs >= this.maxProbs) {
      debugTable.push({
        message: "Reached max probation count!",
        function: "makeFontSizeBigger"
      });
      return;
    }

    this.fontSize = window.getComputedStyle(this.text).fontSize;


    if (parseFloat(this.fontSize) >= this.maxFontSize) {
      debugTable.push({
        message: `Reached max font size ${this.maxFontSize}`,
        function: "makeFontSizeBigger"
      });
      return;
    }

    // no word wrap, check only width
    if (this.text.scrollWidth < this.container.offsetWidth && mode == 0) {
      debugTable.push({
        message: `Increasing font size because of width [fontSize|textWidth|containerWidth|mode]: ${this.fontSize} | ${this.text.scrollWidth} | ${this.container.offsetWidth} | ${mode}`,
        function: "makeFontSizeBigger"
      });
      this.increaseFontSize();
      this.makeFontSizeBigger(mode);
      return;
    }

    // word wrap, check only height
    if (this.text.scrollHeight < this.container.offsetHeight && mode == 1) {
      debugTable.push({
        message: `Increasing font size because of height [fontSize|textHeight|containerHeight|mode]: ${this.fontSize} | ${this.text.scrollHeight} | ${this.container.offsetHeight} | ${mode}`,
        function: "makeFontSizeBigger"
      });
      this.increaseFontSize();
      this.makeFontSizeBigger(mode);
      return;
    }

    // check boundries of container, check width and height
    if (this.text.scrollWidth < this.container.offsetWidth && this.text.scrollHeight < this.container.offsetHeight && mode == 2) {
      debugTable.push({
        message: `Increasing font size because of width and height [fontSize|textWidth|containerWidth|textHeight|containerHeight|mode]: ${this.fontSize} | ${this.text.scrollWidth} | ${this.container.offsetWidth} | ${this.text.scrollHeight} | ${this.container.offsetHeight} | ${mode}`,
        function: "makeFontSizeBigger"
      });
      this.increaseFontSize();
      this.makeFontSizeBigger(mode);
      return;
    }
  }

  /**
    * decreases font size as long as it doesn't reach
    * the minimum font size or the edge of the container
    * or the height of the container depending on the word wrap
    *
    * @param {integer} mode 0 = no word wrap (width), 1 = word wrap (height), 2 = check container boundries (width, height)
    *
    * @returns {void}
    */
  makeFontSizeSmaller(mode = 2) {
    if (this.probs >= this.maxProbs) {
      debugTable.push({
        message: "Reached max probation count!",
        function: "makeFontSizeSmaller"
      });
      return;
    }

    this.fontSize = window.getComputedStyle(this.text).fontSize;

    if (parseFloat(this.fontSize) <= this.minFontSize) {
      debugTable.push({
        message: `Reached min font size ${this.maxFontSize}`,
        function: "makeFontSizeSmaller"
      });
      return;
    }

    if (this.text.scrollWidth >= this.container.offsetWidth && mode == 0) {
      debugTable.push({
        message: `Decreasing font size because of width [fontSize|textWidth|containerWidth|mode]: ${this.fontSize} | ${this.text.scrollWidth} | ${this.container.offsetWidth} | ${mode}`,
        function: "makeFontSizeSmaller"
      });
      this.decreaseFontSize();
      this.makeFontSizeSmaller(mode);
      return;
    }

    if (this.text.scrollHeight >= this.container.offsetHeight && mode == 1) {
      debugTable.push({
        message: `Decreasing font size because of height [fontSize|textHeight|containerHeight|mode]: ${this.fontSize} | ${this.text.scrollHeight} | ${this.container.offsetHeight} | ${mode}`,
        function: "makeFontSizeSmaller"
      });
      this.decreaseFontSize();
      this.makeFontSizeSmaller(mode);
      return;
    }

    // check boundries of container, check width and height
    if (this.text.scrollWidth >= this.container.offsetWidth || this.text.scrollHeight >= this.container.offsetHeight && mode == 2) {
      debugTable.push({
        message: `Decreasing font size because of width and height [fontSize|textWidth|containerWidth|textHeight|containerHeight|mode]: ${this.fontSize} | ${this.text.scrollWidth} | ${this.container.offsetWidth} | ${this.text.scrollHeight} | ${this.container.offsetHeight} | ${mode}`,
        function: "makeFontSizeSmaller"
      });
      this.decreaseFontSize();
      this.makeFontSizeSmaller(mode);
      return;
    }
  }
}
