FROM node:18

WORKDIR /app

COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install

# Copy the rest of your application code
COPY . .

# Expose port 3000 (or the port your app uses)
EXPOSE 3000

# Start the application
CMD ["yarn", "start"]
