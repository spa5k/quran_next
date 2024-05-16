FROM node:22-slim as runner


WORKDIR /app
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1
ENV PORT 3000
ENV HOSTNAME 0.0.0.0

# Copy the .next directory and other built artifacts to the container
# COPY node_modules ./node_modules
COPY .next/standalone ./
COPY public ./apps/web/public
COPY .next/static ./apps/web/.next/static


USER node

EXPOSE 3000


# Start the Next.js app
CMD ["node", "apps/web/server.js"]