import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  Typography,
  Grid,
  CardActionArea,
  Box,
  Chip,
  Breadcrumbs,
  FormControl,
  Select,
  MenuItem,
  IconButton,
  InputAdornment,
  TextField,
  Button,
  CircularProgress,
  Pagination,
  Drawer,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Slider,
  Divider,
  useMediaQuery,
  Stack
} from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import {
  NavigateNext,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Close as CloseIcon,
  FavoriteBorder,
  Favorite,
  ShoppingBag,
  Sort as SortIcon,
  ViewList,
  ViewModule
} from '@mui/icons-material';
import CssBaseline from '@mui/material/CssBaseline';

// Import styled components and theme
import {
  theme,
  ProductCard,
  ProductMedia,
  ProductInfo,
  ProductPrice,
  WishlistButton,
  FilterButton,
  PageHeader,
  FiltersContainer,
  SortContainer,
  ViewToggle,
  ListProductCard,
  ListProductMedia,
  ListProductInfo,
  SearchContainer,
  NoResultsContainer,
  generatePrice
} from '../styles/ProductCatalogStyle';

const ProductCatalog = () => {
  // State management
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('newest');
  const [searchQuery, setSearchQuery] = useState('');
  const [wishlist, setWishlist] = useState({});
  const [filters, setFilters] = useState({
    categories: [],
    priceRange: [0, 200],
    colors: [],
    seasons: [],
  });
  const [availableFilters, setAvailableFilters] = useState({
    categories: [],
    colors: [],
    seasons: [],
  });

  const itemsPerPage = 12;
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));

    // Fetch products from API
    useEffect(() => {
      const fetchProducts = async () => {
        setLoading(true);
        try {
          // In a real app, you would include filters, sort, and pagination in the API call
          // const response = await fetch(`/api/products?page=${currentPage}&limit=${itemsPerPage}&sort=${sortBy}&search=${searchQuery}`);

          const response = await fetch("/api/products");

          if (!response.ok) {
            throw new Error(`Failed to fetch: ${response.status}`);
          }
          
          const data = await response.json();
          
          // Process products to ensure all have required fields
          const processedProducts = data.products.map(product => ({
            ...product,
            price: generatePrice(product),
            image_url: product.image_url || '/images/placeholder.jpg',
            productDisplayName: product.productDisplayName || 'Untitled Product',
            subCategory: product.subCategory || 'Uncategorized',
            baseColour: product.baseColour || 'N/A',
            season: product.season || 'All Season',
          }));
          
          setProducts(processedProducts);
          setTotalPages(Math.ceil(data.totalCount / itemsPerPage));
          
          // Extract available filter options
          if (data.filters) {
            setAvailableFilters(data.filters);
          } else {
            // If the API doesn't provide filter options, extract them from products
            const categories = [...new Set(processedProducts.map(p => p.subCategory))];
            const colors = [...new Set(processedProducts.map(p => p.baseColour))];
            const seasons = [...new Set(processedProducts.map(p => p.season))];
            
            setAvailableFilters({
              categories,
              colors,
              seasons,
            });
          }
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      
      fetchProducts();
    }, [currentPage, sortBy, searchQuery]);
    
    const toggleFilterDrawer = (open) => () => {
      setFilterDrawerOpen(open);
    };
    
    const handleSortChange = (event) => {
      setSortBy(event.target.value);
      setCurrentPage(1); // Reset to first page when changing sort
    };
    
    const handleViewModeChange = (mode) => {
      setViewMode(mode);
    };
    
    const handlePageChange = (event, value) => {
      setCurrentPage(value);
      // Scroll to top when changing page
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    
    const handleSearchChange = (event) => {
      setSearchQuery(event.target.value);
    };
    
    const handleSearchSubmit = (event) => {
      event.preventDefault();
      setCurrentPage(1); // Reset to first page when searching
    };
    
    const toggleWishlist = (productId) => {
      setWishlist(prev => ({
        ...prev,
        [productId]: !prev[productId]
      }));
    };
    
    const handleFilterChange = (type, value) => {
      if (type === 'priceRange') {
        setFilters(prev => ({
          ...prev,
          priceRange: value
        }));
      } else {
        // For checkboxes (categories, colors, seasons)
        setFilters(prev => {
          const currentValues = [...prev[type]];
          const valueIndex = currentValues.indexOf(value);
          
          if (valueIndex === -1) {
            // Add the value
            return {
              ...prev,
              [type]: [...currentValues, value]
            };
          } else {
            // Remove the value
            currentValues.splice(valueIndex, 1);
            return {
              ...prev,
              [type]: currentValues
            };
          }
        });
      }
      
      // Reset to first page when filtering
      setCurrentPage(1);
    };
    
    // Apply filters to products
    const filteredProducts = products.filter(product => {
      // Filter by price range
      const price = product.price || 0;
      if (price < filters.priceRange[0] || price > filters.priceRange[1]) {
        return false;
      }
      
      // Filter by categories
      if (filters.categories.length > 0 && !filters.categories.includes(product.subCategory)) {
        return false;
      }
      
      // Filter by colors
      if (filters.colors.length > 0 && !filters.colors.includes(product.baseColour)) {
        return false;
      }
      
      // Filter by seasons
      if (filters.seasons.length > 0 && !filters.seasons.includes(product.season)) {
        return false;
      }
      
      return true;
    });
    
    // Filter panel content
    const filterContent = (
      <>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Filters</Typography>
          {isSmallScreen && (
            <IconButton onClick={toggleFilterDrawer(false)}>
              <CloseIcon />
            </IconButton>
          )}
        </Box>
        
        <Divider sx={{ mb: 3 }} />
        
        {/* Price Range Filter */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="subtitle1" gutterBottom>Price Range</Typography>
          <Slider
            value={filters.priceRange}
            onChange={(e, newValue) => handleFilterChange('priceRange', newValue)}
            valueLabelDisplay="auto"
            min={0}
            max={200}
            step={10}
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2">${filters.priceRange[0]}</Typography>
            <Typography variant="body2">${filters.priceRange[1]}</Typography>
          </Box>
        </Box>
        
        {/* Category Filter */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="subtitle1" gutterBottom>Category</Typography>
          <FormGroup>
            {availableFilters.categories.map((category) => (
              <FormControlLabel
                key={category}
                control={
                  <Checkbox
                    checked={filters.categories.includes(category)}
                    onChange={() => handleFilterChange('categories', category)}
                    size="small"
                  />
                }
                label={<Typography variant="body2">{category}</Typography>}
              />
            ))}
          </FormGroup>
        </Box>
        
        {/* Color Filter */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="subtitle1" gutterBottom>Color</Typography>
          <FormGroup>
            {availableFilters.colors.map((color) => (
              <FormControlLabel
                key={color}
                control={
                  <Checkbox
                    checked={filters.colors.includes(color)}
                    onChange={() => handleFilterChange('colors', color)}
                    size="small"
                  />
                }
                label={<Typography variant="body2">{color}</Typography>}
              />
            ))}
          </FormGroup>
        </Box>
        
        {/* Season Filter */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="subtitle1" gutterBottom>Season</Typography>
          <FormGroup>
            {availableFilters.seasons.map((season) => (
              <FormControlLabel
                key={season}
                control={
                  <Checkbox
                    checked={filters.seasons.includes(season)}
                    onChange={() => handleFilterChange('seasons', season)}
                    size="small"
                  />
                }
                label={<Typography variant="body2">{season}</Typography>}
              />
            ))}
          </FormGroup>
        </Box>
        
        {/* Clear Filters Button */}
        <Button
          variant="outlined"
          fullWidth
          onClick={() => setFilters({
            categories: [],
            priceRange: [0, 200],
            colors: [],
            seasons: [],
          })}
        >
          Clear All Filters
        </Button>
      </>
    );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="xl" sx={{ py: 6 }}>
        {/* Breadcrumbs navigation */}
        <Breadcrumbs 
          separator={<NavigateNext fontSize="small" />} 
          aria-label="breadcrumb"
          sx={{ mb: 4 }}
        >
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            <Typography variant="body2">Home</Typography>
          </Link>
          <Typography variant="body2" color="text.primary">All Products</Typography>
        </Breadcrumbs>
        
        <PageHeader>
          <Typography variant="h1" sx={{ mb: 1, textAlign: 'center' }}>
            Our Collection
          </Typography>
          <Typography variant="subtitle2" sx={{ mb: 4, textAlign: 'center' }}>
            Discover our latest fashion pieces curated for your style
          </Typography>
          
          {/* Search Bar */}
          <SearchContainer>
            <form onSubmit={handleSearchSubmit}>
              <TextField
                fullWidth
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search products..."
                variant="outlined"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton type="submit" edge="end">
                        <SearchIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </form>
          </SearchContainer>
          
          {/* Mobile Filter Button */}
          <FilterButton
            variant="outlined"
            startIcon={<FilterIcon />}
            onClick={toggleFilterDrawer(true)}
            fullWidth
          >
            Filter Products
          </FilterButton>
        </PageHeader>
        
        <Grid container spacing={4}>
          {/* Filter Sidebar (desktop) */}
          <Grid item md={3} lg={3}>
            <FiltersContainer>
              {filterContent}
            </FiltersContainer>
          </Grid>
          
          {/* Products Grid */}
          <Grid item xs={12} md={9} lg={9}>
            {/* Sort and View Controls */}
            <SortContainer>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <SortIcon sx={{ mr: 1 }} />
                <Typography variant="subtitle2" sx={{ mr: 2 }}>Sort By:</Typography>
                <FormControl variant="standard" size="small" sx={{ minWidth: 120 }}>
                  <Select
                    value={sortBy}
                    onChange={handleSortChange}
                    displayEmpty
                  >
                    <MenuItem value="newest">Newest</MenuItem>
                    <MenuItem value="price_low">Price: Low to High</MenuItem>
                    <MenuItem value="price_high">Price: High to Low</MenuItem>
                    <MenuItem value="name_asc">Name: A to Z</MenuItem>
                    <MenuItem value="name_desc">Name: Z to A</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              
              <ViewToggle>
                <Typography variant="body2" sx={{ mr: 1 }}>View:</Typography>
                <IconButton 
                  color={viewMode === 'grid' ? 'primary' : 'default'}
                  onClick={() => handleViewModeChange('grid')}
                >
                  <ViewModule />
                </IconButton>
                <IconButton 
                  color={viewMode === 'list' ? 'primary' : 'default'}
                  onClick={() => handleViewModeChange('list')}
                >
                  <ViewList />
                </IconButton>
              </ViewToggle>
            </SortContainer>
            
            {loading ? (
              // Loading state
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                <CircularProgress />
              </Box>
            ) : error ? (
              // Error state
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Typography color="error" gutterBottom>Error: {error}</Typography>
                <Button variant="contained" onClick={() => window.location.reload()}>
                  Try Again
                </Button>
              </Box>
            ) : filteredProducts.length === 0 ? (
              // No results state
              <NoResultsContainer>
                <Typography variant="h6" gutterBottom>No products found</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Try adjusting your search or filter criteria
                </Typography>
                <Button 
                  variant="outlined" 
                  onClick={() => {
                    setSearchQuery('');
                    setFilters({
                      categories: [],
                      priceRange: [0, 200],
                      colors: [],
                      seasons: [],
                    });
                  }}
                >
                  Clear Filters
                </Button>
              </NoResultsContainer>
            ) : (
              // Product grid or list
              <>
                <Grid container spacing={3}>
                  {filteredProducts.map((product) => (
                    viewMode === 'grid' ? (
                      // Grid View
                      <Grid item xs={6} sm={6} md={4} key={product.id}>
                        <ProductCard>
                          <CardActionArea component={Link} to={`/product/${product.id}`}>
                            <ProductMedia
                              component="img"
                              image={`http://localhost:8000${product.image_url}`}
                              alt={product.productDisplayName}
                            />
                          </CardActionArea>
                          
                          <WishlistButton 
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              toggleWishlist(product.id);
                            }}
                            aria-label="add to wishlist"
                          >
                            {wishlist[product.id] ? <Favorite color="secondary" /> : <FavoriteBorder />}
                          </WishlistButton>
                          
                          <ProductInfo>
                            <Link 
                              to={`/product/${product.id}`} 
                              style={{ textDecoration: 'none', color: 'inherit' }}
                            >
                              <Typography variant="subtitle1" noWrap gutterBottom>
                                {product.productDisplayName}
                              </Typography>
                              
                              <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                                {product.subCategory}
                              </Typography>
                              
                              <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                                <Chip 
                                  label={product.baseColour} 
                                  size="small" 
                                  sx={{ height: 20 }}
                                />
                                <Chip 
                                  label={product.season} 
                                  size="small" 
                                  sx={{ height: 20 }}
                                />
                              </Stack>
                            </Link>
                            
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                              <ProductPrice variant="subtitle2">
                                ${product.price?.toFixed(2)}
                              </ProductPrice>
                              
                              <Chip
                                label="View"
                                size="small"
                                color="primary"
                                sx={{ minWidth: '60px' }}
                                component={Link}
                                to={`/product/${product.id}`}
                                clickable
                              />
                            </Box>
                          </ProductInfo>
                        </ProductCard>
                      </Grid>
                    ) : (
                      // List View
                      <Grid item xs={12} key={product.id}>
                        <ListProductCard>
                          <CardActionArea 
                            component={Link} 
                            to={`/product/${product.id}`}
                            sx={{ display: 'flex', width: '100%', height: '100%', alignItems: 'stretch' }}
                          >
                            <ListProductMedia
                              component="img"
                              image={`http://localhost:8000${product.image_url}`}
                              alt={product.productDisplayName}
                            />
                            
                            <ListProductInfo>
                              <Box>
                                <Typography variant="h6" gutterBottom>
                                  {product.productDisplayName}
                                </Typography>
                                
                                <Typography variant="body2" color="text.secondary" paragraph>
                                  {product.subCategory}
                                </Typography>
                                
                                <Grid container spacing={2} sx={{ mb: 2 }}>
                                  <Grid item xs={6} sm={4}>
                                    <Typography variant="caption" color="text.secondary">
                                      Color
                                    </Typography>
                                    <Typography variant="body2">
                                      {product.baseColour}
                                    </Typography>
                                  </Grid>
                                  
                                  <Grid item xs={6} sm={4}>
                                    <Typography variant="caption" color="text.secondary">
                                      Season
                                    </Typography>
                                    <Typography variant="body2">
                                      {product.season}
                                    </Typography>
                                  </Grid>
                                  
                                  <Grid item xs={6} sm={4}>
                                    <Typography variant="caption" color="text.secondary">
                                      Usage
                                    </Typography>
                                    <Typography variant="body2">
                                      {product.usage || 'Casual'}
                                    </Typography>
                                  </Grid>
                                </Grid>
                              </Box>
                              
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <ProductPrice variant="h6">
                                  ${product.price?.toFixed(2)}
                                </ProductPrice>
                                
                                <Box>
                                  <IconButton 
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      toggleWishlist(product.id);
                                    }}
                                    aria-label="add to wishlist"
                                    sx={{ mr: 1 }}
                                  >
                                    {wishlist[product.id] ? <Favorite color="secondary" /> : <FavoriteBorder />}
                                  </IconButton>
                                  
                                  <Button
                                    variant="outlined"
                                    startIcon={<ShoppingBag />}
                                    component={Link}
                                    to={`/product/${product.id}`}
                                  >
                                    View Details
                                  </Button>
                                </Box>
                              </Box>
                            </ListProductInfo>
                          </CardActionArea>
                        </ListProductCard>
                      </Grid>
                    )
                  ))}
                </Grid>
                
                {/* Pagination */}
                <Box sx={{ mt: 6, mb: 2, display: 'flex', justifyContent: 'center' }}>
                  <Pagination 
                    count={totalPages} 
                    page={currentPage}
                    onChange={handlePageChange}
                    color="primary"
                    size={isSmallScreen ? "small" : "medium"}
                    showFirstButton
                    showLastButton
                  />
                </Box>
                
                <Typography variant="body2" color="text.secondary" align="center">
                  Showing {filteredProducts.length} of {totalPages * itemsPerPage} products
                </Typography>
              </>
            )}
          </Grid>
        </Grid>
        
        {/* Mobile Filter Drawer */}
        <Drawer
          anchor="left"
          open={filterDrawerOpen}
          onClose={toggleFilterDrawer(false)}
        >
          <Box sx={{ width: 280, p: 2 }}>
            {filterContent}
          </Box>
        </Drawer>
      </Container>
    </ThemeProvider>
  );
};

export default ProductCatalog;