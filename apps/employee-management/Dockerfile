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
COPY apps/employee-management ./apps/employee-management
# Jika ada shared libraries
COPY libs ./libs

# Build aplikasi
RUN npm run build employee-management

# Debug: Lihat hasil build
#RUN ls -la /usr/src/app/dist/apps/employee-management

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
EXPOSE 3000

# Jalankan aplikasi
CMD ["node", "dist/apps/employee-management/main"]