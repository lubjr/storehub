FROM php:8.4-fpm-alpine

RUN apk add --no-cache \
    libzip-dev \
    zip \
    unzip \
    git \
    curl \
    mysql-client \
    oniguruma-dev

RUN docker-php-ext-install \
    pdo \
    pdo_mysql \
    mbstring \
    zip \
    bcmath

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

COPY . .

RUN mkdir -p bootstrap/cache storage/logs storage/framework/cache storage/framework/sessions storage/framework/views

RUN composer install --no-interaction --prefer-dist --optimize-autoloader

RUN chown -R www-data:www-data /var/www/html/storage \
    && chown -R www-data:www-data /var/www/html/bootstrap/cache \
    && chmod -R 775 /var/www/html/storage

EXPOSE 9000
CMD ["php-fpm"]
