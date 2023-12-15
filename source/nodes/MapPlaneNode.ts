import {BufferGeometry, Intersection, MeshBasicMaterial, MeshStandardMaterial, Raycaster, Vector3} from 'three';
import {MapNode, QuadTreePosition} from './MapNode';
import {MapNodeGeometry} from '../geometries/MapNodeGeometry';
import {UnitsUtils} from '../utils/UnitsUtils';
/**
 * Represents a basic plane tile node.
 */
export class MapPlaneNode extends MapNode 
{
	public constructor(parentNode = null, mapView = null, location = QuadTreePosition.root, level = 0, x = 0, y = 0) 
	{
		super(parentNode, mapView, location, level, x, y, MapPlaneNode.geometry, new MeshStandardMaterial({wireframe: false}));

		this.matrixAutoUpdate = false;
		this.isMesh = true;
		this.visible = false;
	}

	/**
	 * Map node plane geometry.
	 */
	public static geometry: BufferGeometry = new MapNodeGeometry(1, 1, 1, 1, false);

	public static baseGeometry: BufferGeometry = MapPlaneNode.geometry;

	public static baseScale: Vector3 = new Vector3(UnitsUtils.EARTH_PERIMETER, 1.0, UnitsUtils.EARTH_PERIMETER);

	public async initialize(): Promise<void>
	{
		super.initialize();
		
		await this.loadData();
		
		this.nodeReady();
	}

	public createChildNodes(): void
	{
		const level = this.level + 1;
		const x = this.x * 2;
		const y = this.y * 2;

		const Constructor = Object.getPrototypeOf(this).constructor;
		
		let node = new Constructor(this, this.mapView, QuadTreePosition.topLeft, level, x, y);
		node.scale.set(0.5, 1.0, 0.5);
		node.position.set(-0.25, 0, -0.25);
		this.add(node);
		node.updateMatrix();
		node.updateMatrixWorld(true);

		node = new Constructor(this, this.mapView, QuadTreePosition.topRight, level, x + 1, y);
		node.scale.set(0.5, 1.0, 0.5);
		node.position.set(0.25, 0, -0.25);
		this.add(node);
		node.updateMatrix();
		node.updateMatrixWorld(true);

		node = new Constructor(this, this.mapView, QuadTreePosition.bottomLeft, level, x, y + 1);
		node.scale.set(0.5, 1.0, 0.5);
		node.position.set(-0.25, 0, 0.25);
		this.add(node);
		node.updateMatrix();
		node.updateMatrixWorld(true);

		node = new Constructor(this, this.mapView, QuadTreePosition.bottomRight, level, x + 1, y + 1);
		node.scale.set(0.5, 1.0, 0.5);
		node.position.set(0.25, 0, 0.25);
		this.add(node);
		node.updateMatrix();
		node.updateMatrixWorld(true);
	}

	/**
	 * Overrides normal raycasting, to avoid raycasting when isMesh is set to false.
	 */
	public raycast(raycaster: Raycaster, intersects: Intersection[]): void
	{
		if (this.isMesh === true) 
		{
			super.raycast(raycaster, intersects);
		}
	}
}
