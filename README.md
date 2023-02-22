# Bar Scout

The Bar Scout is a <strong><i>minimalistic</i></strong> web application that enables people to scan barcodes and save all the info about a product locally. The scanner saves all product information in the browser's localStorage, providing a more secure and faster solution (No registration needed).
<p align="center">
  <img src="https://github.com/nikinayzer/Bar-Scout/blob/main/repo/bar_scout_demo.gif" width="850" title="use example">
</p>

## Features

- Get info about any product by it's barcode (QR codes scan will be added later).
- Full Open Food Facts database.
- Save product information in the browser's localStorage for offline use
- Easy to use
- Multiple barcodes scan (use comma to separate codes). Example: <code>8715700421360,8593807234713</code>

## Getting Started

To get started with the Bar Scout, simply download or clone the repository to your local machine. Then, open the `index.html` file in your web browser and you're ready to go! Or just go to https://nikinayzer.github.io/Bar-Scout/

## Usage

To add a product, simply write the barcode to search field. The scanner will automatically detect and retrieve the product information from the Open Food Facts database, and display it on the screen.

To delete an existing product, hover on a product card and press red delete button, that appears to the right on the card.

## Performance
Some metrics gathered from Lighthouse test:
<p align="center">
  <img src="https://github.com/nikinayzer/Bar-Scout/blob/main/repo/lighthouse_metrics.png" width="550" title="lighthouse overall metrics">
</p>
<p align="center">
  <img src="https://github.com/nikinayzer/Bar-Scout/blob/main/repo/lighthouse_metrics2.png" width="550" title="lighthouse renderings time">
</p>

## Contributing

If you'd like to contribute to the Bar Scout project, feel free to fork the repository and submit a pull request with your changes. I welcome all contributions, big or small!
There is also a [TODO list](https://github.com/users/Nikinayzer/projects/2) where you can see actual goals.

## License

The Bar Scout is released under the MIT License. See the `LICENSE` file for more information.
## Credits

The Local Bar Scanner was created by Nick Korotov.
