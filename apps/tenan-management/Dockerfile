# Stage 1: Build
FROM node:20-alpine AS builder

# Tentukan workdir
WORKDIR /usr/src/app

# Copy package files dan konfigurasi
COPY package*.json ./
COPY tsconfig*.json ./
COPY nest-cli.json ./

# Install dependencies
RUN npm install

# Copy source code aplikasi
COPY apps/tenan-management ./apps/tenan-management
# Jika ada shared libraries
COPY libs ./libs

# Build aplikasi
RUN npm run build tenan-management

# Debug: Uncomment untuk mengecek isi folder build
# RUN ls -la /usr/src/app/dist/apps/tenan-management

# Stage 2: Run
FROM node:20-alpine AS runner

WORKDIR /usr/src/app

# Copy package.json untuk dependencies
COPY package*.json ./

# Install production dependencies only
RUN npm install --only=production

# Copy hasil build dari stage builder
COPY --from=builder /usr/src/app/dist ./dist

# Expose port (sesuaikan dengan port yang digunakan aplikasi)
EXPOSE 3001

# Jalankan aplikasi
CMD ["node", "dist/apps/tenan-management/main"]