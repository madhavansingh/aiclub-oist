#!/bin/bash

# Ensure ghostscript is installed
if ! command -v gs &> /dev/null; then
  echo "Installing Ghostscript..."
  HOMEBREW_NO_AUTO_UPDATE=1 brew install ghostscript
fi

TARGET_DIR="public/Magazines"
cd $TARGET_DIR

# Define quality parameter (ebook is 150 dpi, which is a good balance for web reading without being blurry)
# We can also use 'printer' for 300 dpi if 'ebook' is too blurry, but for 50% compress 'ebook' or custom is best.
# To be safe and retain nice quality with ~50% reduction, let's use 'prepress' or 'printer'. Actually 'ebook' retains nice text and 150dpi images. The user asked for no blur. Let's use /printer (300 dpi). If we need 50%, /ebook (150 dpi) is the standard web quality.

compress_pdf() {
  local input=$1
  local output="opt_$1"

  echo "Compressing $input..."
  gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=/ebook \
     -dNOPAUSE -dQUIET -dBATCH \
     -dColorImageDownsampleType=/Bicubic -dColorImageResolution=150 \
     -dGrayImageDownsampleType=/Bicubic -dGrayImageResolution=150 \
     -dMonoImageDownsampleType=/Bicubic -dMonoImageResolution=150 \
     -sOutputFile="$output" "$input"

  # Compare sizes
  local orig_size=$(ls -lh "$input" | awk '{print $5}')
  local new_size=$(ls -lh "$output" | awk '{print $5}')
  echo "✅ $input: $orig_size -> $new_size"
  
  # Replace original
  mv "$output" "$input"
}

compress_pdf "Edition_1.pdf"
compress_pdf "Edition_2.pdf"
compress_pdf "AIC_Edition3.pdf"

echo "PDF Compression Complete!"
