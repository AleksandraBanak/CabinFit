using AutoMapper;
using CabinFit.Api.Models;
using CabinFit.Api.Models.DTOs.CartDtos;
using CabinFit.Api.Models.DTOs.CategoryDtos;
using CabinFit.Api.Models.DTOs.OrderDtos;
using CabinFit.Api.Models.DTOs.OrderItemDtos;
using CabinFit.Api.Models.DTOs.ProductDtos;
using CabinFit.Api.Models.DTOs.WishListItemDtos;

namespace CabinFit.Api.Mappings
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            CreateMap<CreateProductDto, Product>().ForMember(dest => dest.Images, opt => opt.Ignore());
            CreateMap<UpdateProductDto, Product>().ForMember(dest => dest.Images, opt => opt.Ignore());
            CreateMap<PatchProductDto, Product>().ForAllMembers(opts =>
            opts.Condition((src, dest, srcMember, context) =>
            {

                if (srcMember == null) return false;

                var type = srcMember.GetType();
                if (Nullable.GetUnderlyingType(type) != null)
                {
                    var value = Convert.ChangeType(srcMember, Nullable.GetUnderlyingType(type)!);

                    return true;
                }

                return true;
            }));

            CreateMap<Product, ProductDto>()
                .ForMember(dest => dest.CategoryName, opt => opt.MapFrom(src => src.Category.Name))
                .ForMember(dest => dest.Images, opt => opt.MapFrom(src => src.Images.Select(i => i.Url)))
                .ForMember(d => d.AverageRating, 
                           opt => opt.MapFrom(s => s.Ratings.Any() 
                           ? Math.Round(s.Ratings.Average(r => r.Rating),2) : 0))
                .ForMember(d => d.RatingsCount, opt => opt.MapFrom(s => s.Ratings.Count))
                .ForMember(dest => dest.FinalPrice, opt => opt.MapFrom(src => 
                src.DiscountPercentage.HasValue && src.DiscountPercentage > 0 
                       ? Math.Round(src.Price - (src.Price * src.DiscountPercentage.Value / 100), 2)
                       : src.Price));

            CreateMap<CreateCategoryDto, Category>().ReverseMap();
            CreateMap<UpdateCategoryDto, Category>().ReverseMap();
            CreateMap<Category, CategoryDto>();

            CreateMap<Order, OrderDto>()
                .ForMember(dest => dest.Status, opt => opt.MapFrom(src => 
                src.Status == OrderStatus.InDelivery ? "In Delivery" : src.Status.ToString()))
                .ForMember(dest => dest.VoucherCode, opt => opt.MapFrom(src => src.Voucher != null ? src.Voucher.Code : null)); ;
            CreateMap<OrderItem, OrderItemDto>()
                .ForMember(dest => dest.ProductName, opt => opt.MapFrom(src => src.Product.Name))
                .ForMember(dest => dest.ProductImage, opt => opt.MapFrom(src => src.Product != null && 
                src.Product.Images.Any() ? src.Product.Images.First().Url : null));

            CreateMap<CreateOrderItemDto, OrderItem>().ReverseMap();
            CreateMap<UpdateOrderItemDto, OrderItem>().ReverseMap();

            CreateMap<Cart, CartDto>();
            CreateMap<CartItem, CartItemDto>()
                .ForMember(dest => dest.ProductName, opt => opt.MapFrom(src => src.Product.Name))
                .ForMember(dest => dest.ProductImages, opt => opt.MapFrom(src =>
                src.Product != null ? src.Product.Images.Select(i => i.Url).ToList() : new List<string>()))
                .ForMember(dest => dest.Price, opt => opt.MapFrom(src => src.Product != null ? src.Product.Price : 0m))
                .ForMember(dest => dest.DiscountPercentage, opt => opt.MapFrom(src => src.Product != null ? src.Product.DiscountPercentage : null))
                .ForMember(dest => dest.FinalPrice, opt => opt.MapFrom(src => src.Product != null ? src.Product.FinalPrice : 0m))
                .ForMember(dest => dest.Width, opt => opt.MapFrom(src => src.Product != null ? src.Product.Width : 0m))
                .ForMember(dest => dest.Height, opt => opt.MapFrom(src => src.Product != null ? src.Product.Height : 0m))
                .ForMember(dest => dest.Depth, opt => opt.MapFrom(src => src.Product != null ? src.Product.Depth : 0m))
                .ForMember(dest => dest.StockQuantity, opt => opt.MapFrom(src => src.Product != null ? src.Product.StockQuantity : 0));


            CreateMap<CartItemDto, CartItem>()
                .ForMember(dest => dest.Cart, opt => opt.Ignore())
                .ForMember(dest => dest.Product, opt => opt.Ignore());
            CreateMap<CreateCartItemDto, CartItem>();
            CreateMap<UpdateCartItemDto, CartItem>();

            CreateMap<Voucher, VoucherDto>().ReverseMap();

            CreateMap<WishListItem, WishListItemDto>()
                .ForMember(dest => dest.ProductName, opt => opt.MapFrom(src => src.Product.Name))
                .ForMember(dest => dest.Price, opt => opt.MapFrom(src => src.Product.Price))
                .ForMember(dest => dest.FinalPrice, opt => opt.MapFrom(src => src.Product.FinalPrice))
                .ForMember(dest => dest.DiscountPercentage, opt => opt.MapFrom(src => src.Product.DiscountPercentage))
                .ForMember(dest => dest.StockQuantity, opt => opt.MapFrom(src => src.Product.StockQuantity))
                .ForMember(dest => dest.Width, opt => opt.MapFrom(src => src.Product.Width))
                .ForMember(dest => dest.Height, opt => opt.MapFrom(src => src.Product.Height))
                .ForMember(dest => dest.Depth, opt => opt.MapFrom(src => src.Product.Depth))
                .ForMember(dest => dest.Color, opt => opt.MapFrom(src => src.Product.Color))
                .ForMember(dest => dest.CategoryName, opt => opt.MapFrom(src => src.Product.Category.Name))
                .ForMember(dest => dest.Images, opt => opt.MapFrom(src => src.Product.Images.Select(i => i.Url).ToList()))
                .ForMember(dest => dest.AverageRating, opt => opt.MapFrom(src =>
                           src.Product.Ratings.Any() ? src.Product.Ratings.Average(r => r.Rating): 0))
                .ForMember(dest => dest.RatingsCount, opt => opt.MapFrom(src =>
                           src.Product.Ratings.Count()));
        }
    }
}
