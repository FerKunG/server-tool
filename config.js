/*
 * Public runtime configuration for the storefront.
 *
 * PAYMENTS_API is the public, HTTPS origin of the payments service
 * (for example "https://pay.fernode.online"). Leave it empty until that
 * service is deployed: the order-tracking page then explains that online
 * tracking is not open yet instead of calling a host that does not exist.
 *
 * Do not put secrets, Stripe keys or admin tokens here. This file is public.
 */
window.FERNODE_PAYMENTS_API = '';
