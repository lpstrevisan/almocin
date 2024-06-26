import ItemMenuEntity from '../entities/item-menu.entity';
import MenuModel from '../models/item-menu.model';
import CategoryRepository from '../repositories/category.repository';
import MenuRepository from '../repositories/menu.repository';
import { HttpNotFoundError } from '../utils/errors/http.error';

class MenuService {
  private menuRepository: MenuRepository;
  private categoryRepository: CategoryRepository;

  constructor(
    menuRepository: MenuRepository,
    categoryRepository: CategoryRepository
  ) {
    this.menuRepository = menuRepository;
    this.categoryRepository = categoryRepository;
  }

  public async getItems(): Promise<MenuModel[]> {
    const entity = await this.menuRepository.getItems();
    const categories = await this.categoryRepository.getCategories();

    const model = entity.map((item) => new MenuModel({
      ...item,
      category: categories?.find((c) => c.id === item.categoryID) || null,
      hasPromotion: item.oldPrice > item.price,
    }));

    return model;
  }

  public async getItem(id: string): Promise<MenuModel> {
    const entity = await this.menuRepository.getItem(id);

    if (!entity) {
      throw new HttpNotFoundError({
        msg: 'Não encontrado',
        msgCode: 'Item não encontrado no cardápio',
      });
    }

    const category = await this.categoryRepository.getCategory(entity.categoryID);
    const model = new MenuModel({
      ...entity,
      category: category || null,
      hasPromotion: entity.oldPrice > entity.price,
    });

    return model;
  }

  public async createItem(data: ItemMenuEntity): Promise<MenuModel> {
    data.oldPrice = data.price;
    const entity = await this.menuRepository.createItem(data);
    const category = await this.categoryRepository.getCategory(entity.categoryID);
    const model = new MenuModel({
      ...entity,
      oldPrice: data.oldPrice,
      category: category || null,
      hasPromotion: entity.oldPrice > entity.price,
    });

    return model;
  }

  public async updateItem(id: string, data: ItemMenuEntity): Promise<MenuModel> {
    const entity = await this.menuRepository.updateItem(id, data);

    if (!entity) {
      throw new HttpNotFoundError({
        msg: 'Não encontrado',
        msgCode: 'Item não encontrado no cardápio',
      });
    }

    const category = await this.categoryRepository.getCategory(entity.categoryID);

    const model = new MenuModel({
      ...entity,
      category: category || null,
      hasPromotion: entity.oldPrice > entity.price,
    });

    return model;
  }

  public async deleteItem(id: string): Promise<void> {
    await this.menuRepository.deleteItem(id);
  }
}

export default MenuService;
