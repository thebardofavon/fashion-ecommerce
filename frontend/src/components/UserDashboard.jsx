// import React from 'react';
// import ResponsiveAppBar from './ResponsiveAppBar';

// const UserDashboard = () => {
//     return (
//         <div>
//             <ResponsiveAppBar />
//             <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
//                 <h1>User Dashboard</h1>
//             </div>
//         </div>
//     )
// };

// export default UserDashboard;

import React, { useState, useEffect } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Container, 
  Grid, 
  Card, 
  CardMedia, 
  CardContent, 
  IconButton, 
  Badge, 
  Menu, 
  MenuItem, 
  Drawer, 
  List, 
  ListItem, 
  ListItemText, 
  Divider,
  Box,
  InputBase,
  TextField,
  FormControl,
  InputAdornment
} from '@mui/material';
import { 
  ShoppingCart, 
  Favorite, 
  Person, 
  Search, 
  Menu as MenuIcon,
  Close
} from '@mui/icons-material';
import { styled, alpha } from '@mui/material/styles';
import { useNavigate } from "react-router-dom";

// Mock data for featured products
const featuredProducts = [
  { id: 1, name: "Women's Summer Dress", price: "$49.99", image: "/assets/all-items/image1.png", category: "women" },
  { id: 2, name: "Men's Casual Shirt", price: "$39.99", image: "/assets/all-items/image2.png", category: "men" },
  { id: 3, name: "Kids' Playsuit", price: "$29.99", image: "/assets/all-items/image3.png", category: "kids" },
  { id: 4, name: "Designer Handbag", price: "$79.99", image: "/assets/all-items/image4.png", category: "accessories" },
  { id: 5, name: "Floral Print Blouse", price: "$45.99", image: "/assets/all-items/image5.png", category: "women" },
  { id: 6, name: "Slim Fit Jeans", price: "$59.99", image: "/assets/all-items/image6.png", category: "men" },
  { id: 7, name: "Home Decor Cushion", price: "$24.99", image: "/assets/all-items/image7.png", category: "home" },
  { id: 8, name: "Statement Necklace", price: "$34.99", image: "/assets/all-items/image8.png", category: "accessories" }
];

// Styled components for search bar
const SearchBar = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

// Hero banner carousel items
const carouselItems = [
  {
    id: 1,
    image: "/assets/carousel-images/image1.webp",
    title: "NEW ARRIVALS",
    subtitle: "Spring Collection 2025",
    action: "Shop Now"
  },
  {
    id: 2,
    image: "/assets/carousel-images/image2.webp",
    title: "SUMMER ESSENTIALS",
    subtitle: "Hot Season Deals",
    action: "Discover More"
  },
  {
    id: 3,
    image: "/assets/carousel-images/image3.webp",
    title: "EXCLUSIVE ACCESSORIES",
    subtitle: "Complete Your Look",
    action: "Browse Collection"
  },
  {
    id: 4,
    image: "/assets/carousel-images/image4.webp",
    title: "DESIGNER COLLECTION",
    subtitle: "Luxury Fashion Pieces",
    action: "View Collection"
  },
  {
    id: 5,
    image: "/assets/carousel-images/image5.webp",
    title: "SEASONAL SALE",
    subtitle: "Up to 50% Off Selected Items",
    action: "Shop Sale"
  },
  {
    id: 6,
    image: "/assets/carousel-images/image6.webp",
    title: "TRENDING NOW",
    subtitle: "Most Popular Styles",
    action: "Explore More"
  }
];

// Main Home component
const UserDashboard = ({ username }) => {
  const [cartItems, setCartItems] = useState(0);
  const [wishlistItems, setWishlistItems] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const navigate = useNavigate();
  
  // User menu handling
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    window.localStorage.removeItem("loggedAdmin");
    window.localStorage.removeItem("loggedUser");
    console.log("Logged out");
    navigate("/", { replace: true });
  };
  
  // Drawer handling
  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  // Filter products by category
  const handleCategoryChange = (category) => {
    setCategoryFilter(category);
    setDrawerOpen(false);
  };

  const filteredProducts = categoryFilter === 'all' 
    ? featuredProducts 
    : featuredProducts.filter(product => product.category === categoryFilter);

  return (
    <div>
      {/* Navigation Bar */}
      {/*-----------------------------------------------------------------------------------------------------------------------*/}
      <AppBar position="static" color="default" elevation={0} sx={{ borderBottom: '1px solid #e0e0e0' }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={toggleDrawer(true)}
            sx={{ mr: 2, display: { xs: 'flex', md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ display: { xs: 'none', sm: 'block' }, fontWeight: 'bold', letterSpacing: '0.1em' }}
          >
            FASHION AI
          </Typography>
          
          <Box sx={{ display: { xs: 'none', md: 'flex' }, ml: 4 }}>
            <Button color="inherit" onClick={() => handleCategoryChange('women')}>Women</Button>
            <Button color="inherit" onClick={() => handleCategoryChange('men')}>Men</Button>
            <Button color="inherit" onClick={() => handleCategoryChange('kids')}>Kids</Button>
            <Button color="inherit" onClick={() => handleCategoryChange('accessories')}>Accessories</Button>
            <Button color="inherit" onClick={() => handleCategoryChange('home')}>Home</Button>
          </Box>
          
          <Box sx={{ flexGrow: 1 }} />
          
          <SearchBar>
            <SearchIconWrapper>
              <Search />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ 'aria-label': 'search' }}
            />
          </SearchBar>
          
          <Box sx={{ display: 'flex' }}>
            <IconButton color="inherit">
              <Badge badgeContent={wishlistItems} color="error">
                <Favorite />
              </Badge>
            </IconButton>
            <IconButton color="inherit">
              <Badge badgeContent={cartItems} color="error">
                <ShoppingCart />
              </Badge>
            </IconButton>
            <IconButton
              edge="end"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenuOpen}
              color="inherit"
            >
              <Person />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      
      {/* User Menu */}
      <Menu
        id="menu-appbar"
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMenuClose}>
          <Typography variant="body2">Welcome, {username || 'User'}!</Typography>
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
        <MenuItem onClick={handleMenuClose}>My Orders</MenuItem>
        <MenuItem onClick={handleMenuClose}>Settings</MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
      

      {/*--------------------------------------------------------------------------------------------------------*/}

      {/* Mobile Navigation Drawer */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
      >
        <Box
          sx={{ width: 250 }}
          role="presentation"
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>FASHION AI</Typography>
            <IconButton onClick={toggleDrawer(false)}>
              <Close />
            </IconButton>
          </Box>
          <Divider />
          <List>
            {['Women', 'Men', 'Kids', 'Accessories', 'Home'].map((text) => (
              <ListItem 
                button 
                key={text} 
                onClick={() => handleCategoryChange(text.toLowerCase())}
              >
                <ListItemText primary={text} />
              </ListItem>
            ))}
          </List>
          <Divider />
          <List>
            {['My Account', 'Wishlist', 'Cart', 'Orders'].map((text) => (
              <ListItem button key={text}>
                <ListItemText primary={text} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
      
      {/* Hero Banner Carousel */}
      <Box sx={{ position: 'relative', mb: 4, overflow: 'hidden' }}>
        <Box
          component="img"
          sx={{
            width: '100%',
            height: { xs: 300, sm: 400 },
            objectFit: 'cover',
          }}
          src={carouselItems[0].image}
          alt={carouselItems[0].title}
        />
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.4)',
            color: 'white',
            textAlign: 'center',
          }}
        >
          <Typography
            variant="h3"
            component="div"
            sx={{
              fontWeight: 'bold',
              letterSpacing: '0.1em',
              mb: 2,
              fontSize: { xs: '1.8rem', sm: '2.5rem', md: '3rem' }
            }}
          >
            {carouselItems[0].title}
          </Typography>
          <Typography
            variant="h5"
            component="div"
            sx={{ mb: 3, fontSize: { xs: '1.2rem', sm: '1.5rem' } }}
          >
            {carouselItems[0].subtitle}
          </Typography>
          <Button
            variant="contained"
            size="large"
            sx={{
              backgroundColor: 'white',
              color: 'black',
              '&:hover': {
                backgroundColor: '#f0f0f0',
              },
              px: 4,
              py: 1,
            }}
          >
            {carouselItems[0].action}
          </Button>
        </Box>
      </Box>
      
      {/* AI Feature Highlight */}
      <Container maxWidth="lg" sx={{ mb: 6 }}>
        <Box
          sx={{
            backgroundColor: '#f8f8f8',
            p: 4,
            borderRadius: 2,
            textAlign: 'center',
            mb: 4
          }}
        >
          <Typography variant="h4" component="h2" gutterBottom>
            Smart Fashion Recommendations
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            Our AI-powered recommendation engine helps you find the perfect outfit combinations.
          </Typography>
          <Grid container spacing={2} justifyContent="center">
            <Grid item xs={12} sm={6} md={5}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardMedia
                  component="img"
                  image="/api/placeholder/500/300"
                  alt="AI Recommendation Example"
                  height="200"
                />
                <CardContent>
                  <Typography variant="h6" component="div">
                    Product Recommendations
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Discover items that perfectly complement your current selection
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={5}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardMedia
                  component="img"
                  image="/api/placeholder/500/300"
                  alt="Image Upload Feature"
                  height="200"
                />
                <CardContent>
                  <Typography variant="h6" component="div">
                    Image Upload Feature
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Upload your own clothing image and get matching recommendations
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <Button variant="outlined" size="small">
                      Try it now
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Container>
      
      {/* Featured Products */}
      <Container maxWidth="lg" sx={{ mb: 6 }}>
        <Typography
          variant="h4"
          component="h2"
          sx={{ mb: 4, textAlign: 'center', fontWeight: 'medium' }}
        >
          {categoryFilter === 'all' ? 'Featured Products' : `${categoryFilter.charAt(0).toUpperCase() + categoryFilter.slice(1)}'s Collection`}
        </Typography>
        
        <Grid container spacing={3}>
          {filteredProducts.map((product) => (
            <Grid item key={product.id} xs={6} sm={4} md={3}>
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  '&:hover': {
                    boxShadow: 6,
                    '& .MuiCardMedia-root': {
                      transform: 'scale(1.05)',
                      transition: 'transform 0.3s ease-in-out'
                    }
                  }
                }}
              >
                <Box sx={{ position: 'relative', overflow: 'hidden' }}>
                  <CardMedia
                    component="img"
                    image={product.image}
                    alt={product.name}
                    height="250"
                    sx={{ 
                      transition: 'transform 0.3s ease-in-out',
                      cursor: 'pointer'
                    }}
                  />
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      width: '100%',
                      bgcolor: 'rgba(0, 0, 0, 0.3)',
                      color: 'white',
                      padding: '8px 0',
                      textAlign: 'center',
                      opacity: 0,
                      transition: 'opacity 0.3s ease-in-out',
                      '&:hover': {
                        opacity: 1,
                      },
                    }}
                  >
                    <Typography variant="body2">View Details</Typography>
                  </Box>
                </Box>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="body1" component="div" noWrap>
                    {product.name}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                    <Typography variant="body2" color="text.secondary" fontWeight="bold">
                      {product.price}
                    </Typography>
                    <Box>
                      <IconButton size="small">
                        <Favorite fontSize="small" />
                      </IconButton>
                      <IconButton size="small">
                        <ShoppingCart fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Button variant="outlined" size="large">
            View All Products
          </Button>
        </Box>
      </Container>
      
      {/* Email Subscription */}
      <Box sx={{ bgcolor: '#f5f5f5', py: 6, mb: 4 }}>
        <Container maxWidth="md">
          <Typography variant="h5" align="center" gutterBottom>
            Subscribe for Exclusive Offers
          </Typography>
          <Typography variant="body1" align="center" color="text.secondary" paragraph>
            Join our newsletter to receive updates on new arrivals, special offers and AI features.
          </Typography>
          <Box component="form" noValidate sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              label="Email Address"
              name="email"
              autoComplete="email"
              sx={{ width: { xs: '70%', md: '50%' }, mr: 1 }}
              size="small"
            />
            <Button
              type="submit"
              variant="contained"
              sx={{ mt: 2, mb: 2, height: 40 }}
            >
              Subscribe
            </Button>
          </Box>
        </Container>
      </Box>
      
      {/* Footer */}
      <Box component="footer" sx={{ bgcolor: 'background.paper', py: 6 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} justifyContent="space-between">
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="h6" gutterBottom>
                FASHION AI
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Your AI-powered fashion discovery platform.
              </Typography>
            </Grid>
            <Grid item xs={6} sm={3} md={2}>
              <Typography variant="subtitle1" gutterBottom>
                Shop
              </Typography>
              <Typography variant="body2" component="p" gutterBottom>
                Women
              </Typography>
              <Typography variant="body2" component="p" gutterBottom>
                Men
              </Typography>
              <Typography variant="body2" component="p" gutterBottom>
                Kids
              </Typography>
              <Typography variant="body2" component="p" gutterBottom>
                Accessories
              </Typography>
            </Grid>
            <Grid item xs={6} sm={3} md={2}>
              <Typography variant="subtitle1" gutterBottom>
                Help
              </Typography>
              <Typography variant="body2" component="p" gutterBottom>
                Customer Service
              </Typography>
              <Typography variant="body2" component="p" gutterBottom>
                My Account
              </Typography>
              <Typography variant="body2" component="p" gutterBottom>
                Store Locator
              </Typography>
              <Typography variant="body2" component="p" gutterBottom>
                Legal & Privacy
              </Typography>
            </Grid>
            <Grid item xs={6} sm={3} md={2}>
              <Typography variant="subtitle1" gutterBottom>
                About
              </Typography>
              <Typography variant="body2" component="p" gutterBottom>
                Company Information
              </Typography>
              <Typography variant="body2" component="p" gutterBottom>
                Careers
              </Typography>
              <Typography variant="body2" component="p" gutterBottom>
                Press
              </Typography>
              <Typography variant="body2" component="p" gutterBottom>
                Sustainability
              </Typography>
            </Grid>
          </Grid>
          <Box mt={5}>
            <Typography variant="body2" color="text.secondary" align="center">
              {'© '}
              {new Date().getFullYear()}
              {' Fashion AI. All rights reserved.'}
            </Typography>
          </Box>
        </Container>
      </Box>
    </div>
  );
};

export default UserDashboard;