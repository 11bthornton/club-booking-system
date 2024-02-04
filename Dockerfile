# Use the official PHP image with PHP-FPM as the base
FROM php:8.2-fpm

# Install system dependencies required for PHP extensions and other tools
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    libfreetype6-dev \
    libjpeg62-turbo-dev \
    libwebp-dev \
    libxpm-dev \
    libgd-dev \
    libzip-dev

# Clear cache to reduce layer size
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# Install PHP extensions required by Laravel and other common extensions
RUN docker-php-ext-configure gd --with-freetype --with-jpeg --with-webp --with-xpm \
    && docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd zip

# Install Node.js
RUN curl -sL https://deb.nodesource.com/setup_16.x | bash - && \
    apt-get install -y nodejs

# Explicitly install npm in case it's missing
RUN apt-get install -y npm

# Check Node.js and npm versions
RUN node --version && npm --version

# Install Composer globally
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set the working directory to /var/www
WORKDIR /var/www

# Copy the application code to the container
COPY . /var/www

# Set permissions for the copied directory
COPY --chown=www-data:www-data . /var/www

# Install Composer dependencies for Laravel
RUN composer install --no-interaction --no-plugins --no-scripts --prefer-dist

# Install npm dependencies for React and build the project
RUN npm install --force && npm run build

# Expose port 9000 for PHP-FPM
EXPOSE 9000

# Start PHP-FPM
CMD ["php-fpm"]
