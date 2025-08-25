"use client"

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Search, X, Database, Loader2 } from 'lucide-react';
import { foodNutritionService } from '@/lib/ai-service';

interface NutritionRow {
  name: string;
  energy: number;
  protein: number;
  fat: number;
  carbohydrate: number;
  sugar: number;
  sodium: number;
  transFat: number;
  saturatedFat: number;
  cholesterol: number;
}

interface Ingredient {
  id: string
  name: string
  weight: number
  ratio: number
  notes: string
}

interface Step3NutritionProps {
  productName: string;
  mainIngredients: string;
  productType: string;
  totalWeight: number;
  ingredients: Ingredient[];
  nutrition: NutritionRow[];
  onNutritionChange: (nutrition: NutritionRow[]) => void;
}

const DEFAULT_NUTRITION: NutritionRow[] = [
  { name: '재료1', energy: 0, protein: 4.84, fat: 2.57, carbohydrate: 3.74, sugar: 0.91, sodium: 155.00, transFat: 0.01, saturatedFat: 0.35, cholesterol: 0.00 },
  { name: '재료2', energy: 0, protein: 9.00, fat: 3.00, carbohydrate: 69.00, sugar: 7.00, sodium: 1330.00, transFat: 0, saturatedFat: 1.00, cholesterol: 0.00 },
  { name: '재료3', energy: 0, protein: 0.95, fat: 0.04, carbohydrate: 2.35, sugar: 1.70, sodium: 2.00, transFat: 0.00, saturatedFat: 0.01, cholesterol: 0.00 },
  { name: '재료4', energy: 0, protein: 28.00, fat: 46.00, carbohydrate: 20.00, sugar: 5.00, sodium: 0.00, transFat: 0.00, saturatedFat: 8.50, cholesterol: 0.00 },
];

export function Step3Nutrition({
  productName,
  mainIngredients,
  productType,
  totalWeight,
  ingredients,
  nutrition,
  onNutritionChange
}: Step3NutritionProps) {
  const [localNutrition, setLocalNutrition] = useState<NutritionRow[]>([]);
  
  // DB 연결 관련 상태
  const [showIngredientModal, setShowIngredientModal] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [selectedIngredient, setSelectedIngredient] = useState<{ name: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // 무한 루프 방지를 위한 ref
  const isInitialized = useRef(false);

  // localStorage에서 영양성분 데이터 복원
  useEffect(() => {
    const savedNutrition = localStorage.getItem('step3Nutrition');
    if (savedNutrition && !isInitialized.current) {
      try {
        const parsedNutrition = JSON.parse(savedNutrition);
        if (Array.isArray(parsedNutrition) && parsedNutrition.length > 0) {
          setLocalNutrition(parsedNutrition);
          isInitialized.current = true; // 초기 복원 완료 표시
          console.log('localStorage에서 영양성분 데이터 복원:', parsedNutrition);
          // 부모에게도 복원된 데이터 전달
          onNutritionChange(parsedNutrition);
        }
      } catch (error) {
        console.error('localStorage 데이터 파싱 오류:', error);
      }
    }
  }, []);

  // localNutrition이 변경될 때마다 localStorage에 저장
  useEffect(() => {
    if (localNutrition.length > 0 && isInitialized.current) {
      localStorage.setItem('step3Nutrition', JSON.stringify(localNutrition));
      console.log('localStorage에 영양성분 데이터 저장:', localNutrition);
    }
  }, [localNutrition]);

  // 컴포넌트 언마운트 시 부모에게 최종 데이터 전달
  useEffect(() => {
    return () => {
      if (localNutrition.length > 0 && isInitialized.current) {
        console.log('Step3Nutrition 언마운트 시 최종 데이터 전달:', localNutrition);
        // 즉시 부모에게 데이터 전달 (setTimeout 없이)
        onNutritionChange(localNutrition);
        // localStorage에도 최종 저장
        localStorage.setItem('step3Nutrition', JSON.stringify(localNutrition));
      }
    };
  }, [localNutrition, onNutritionChange]);

  // onNutritionChange를 안전하게 호출하기 위한 콜백
  const safeNutritionChange = useCallback((nutrition: NutritionRow[]) => {
    if (isInitialized.current) {
      // 즉시 부모에게 데이터 전달
      onNutritionChange(nutrition);
      console.log('부모에게 영양성분 데이터 전달:', nutrition);
    }
  }, [onNutritionChange]);

  // nutrition prop이 변경될 때 localNutrition 동기화
  useEffect(() => {
    if (nutrition && nutrition.length > 0 && !isInitialized.current) {
      setLocalNutrition(nutrition);
      isInitialized.current = true; // prop 기반 복원 시 초기화 완료
      console.log('nutrition prop에서 데이터 복원:', nutrition);
    } else if (nutrition && nutrition.length === 0 && localNutrition.length > 0) {
      // nutrition이 빈 배열이고 localNutrition에 데이터가 있으면 유지
      console.log('nutrition prop이 빈 배열이지만 기존 데이터 유지:', localNutrition);
      // 부모에게 기존 데이터 전달하여 덮어쓰기 방지
      onNutritionChange(localNutrition);
    }
  }, [nutrition, localNutrition.length, onNutritionChange]);

  // 재료 목록이 변경될 때 영양성분 테이블 초기화 (초기 1회만, 이미 복원되었으면 스킵)
  useEffect(() => {
    if (ingredients && ingredients.length > 0 && !isInitialized.current && localNutrition.length === 0) {
      const nutritionRows: NutritionRow[] = ingredients.map(ingredient => ({
        name: ingredient.name,
        energy: 0,
        protein: 0,
        fat: 0,
        carbohydrate: 0,
        sugar: 0,
        sodium: 0,
        transFat: 0,
        saturatedFat: 0,
        cholesterol: 0
      }));
      
      setLocalNutrition(nutritionRows);
      // 초기 세팅 시 부모 콜백 호출하지 않음 (덮어쓰기/루프 방지)
      isInitialized.current = true;
    }
  }, [ingredients, localNutrition.length]);

  // 재료가 변경될 때마다 영양성분 테이블 업데이트 (기존 데이터 보존)
  useEffect(() => {
    if (ingredients && ingredients.length > 0 && localNutrition.length === 0 && isInitialized.current) {
      const updatedNutrition = ingredients.map((ingredient, index) => ({
        name: ingredient.name || `재료${index + 1}`,
        energy: 0,
        protein: 0,
        fat: 0,
        carbohydrate: 0,
        sugar: 0,
        sodium: 0,
        transFat: 0,
        saturatedFat: 0,
        cholesterol: 0
      }));
      setLocalNutrition(updatedNutrition);
      safeNutritionChange(updatedNutrition);
    }
  }, [ingredients, localNutrition.length, safeNutritionChange]);

  // 영양성분 변경 핸들러
  const handleNutritionChange = (index: number, field: keyof NutritionRow, value: number) => {
    const updatedNutrition = [...localNutrition];
    updatedNutrition[index] = {
      ...updatedNutrition[index],
      [field]: value
    };
    setLocalNutrition(updatedNutrition);
    
    // 항상 부모 컴포넌트에 변경사항 전달
    safeNutritionChange(updatedNutrition);
  };

  // 총계 계산
  const totals = localNutrition.reduce((acc, row) => ({
    energy: acc.energy + (row.energy || 0),
    protein: acc.protein + (row.protein || 0),
    fat: acc.fat + (row.fat || 0),
    carbohydrate: acc.carbohydrate + (row.carbohydrate || 0),
    sugar: acc.sugar + (row.sugar || 0),
    sodium: acc.sodium + (row.sodium || 0),
    transFat: acc.transFat + (row.transFat || 0),
    saturatedFat: acc.saturatedFat + (row.saturatedFat || 0),
    cholesterol: acc.cholesterol + (row.cholesterol || 0)
  }), {
    energy: 0,
    protein: 0,
    fat: 0,
    carbohydrate: 0,
    sugar: 0,
    sodium: 0,
    transFat: 0,
    saturatedFat: 0,
    cholesterol: 0
  });

  // 배합비 계산 (ingredients에서 가져옴)
  const totalRatio = ingredients.reduce((sum, ingredient) => sum + ingredient.ratio, 0);
  const isRatioNearLimit = totalRatio > 95;
  const isRatioOverLimit = totalRatio > 100;

  // DB 연결 모달 열기
  const handleDBConnect = () => {
    if (ingredients.length === 0) {
      alert("먼저 재료를 입력해주세요.");
      return;
    }
    setShowIngredientModal(true);
  };

  // 재료 선택 시 검색 모달 열기
  const handleIngredientSelect = (ingredient: { name: string }) => {
    setSelectedIngredient(ingredient);
    setSearchQuery(ingredient.name); // 검색어를 재료명으로 미리 설정
    setShowIngredientModal(false);
    setShowSearchModal(true);
  };

  // 실제 백엔드 API를 호출하여 식품 검색
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const result = await foodNutritionService.searchFood(searchQuery.trim(), 1, 20);
      
      if (result.success && result.data) {
        setSearchResults(result.data);
        console.log('🔍 식품 검색 결과:', result);
      } else {
        console.error('식품 검색 실패:', result.error);
        setSearchResults([]);
      }
    } catch (error) {
      console.error('식품 검색 중 오류:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // 검색어가 변경될 때마다 자동 검색 (디바운싱)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim()) {
        handleSearch();
      } else {
        setSearchResults([]);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Enter 키로 검색 실행
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // 식품 선택 시 영양성분 테이블에 적용
  const handleFoodSelect = (food: any) => {
    console.log('선택된 식품:', food);
    
    // 선택된 재료에 해당하는 영양성분 행 찾기
    const targetRow = localNutrition.find(row => 
      row.name === selectedIngredient?.name
    );
    
    if (targetRow) {
      // 백엔드 응답 형식에 맞게 영양성분 데이터 매핑
      const updatedNutrition = localNutrition.map(row => {
        if (row.name === selectedIngredient?.name) {
          return {
            ...row,
            energy: food.energy || 0,
            protein: food.protein || 0,
            fat: food.fat || 0,
            carbohydrate: food.carbohydrate || 0,
            sugar: food.sugar || 0,
            sodium: food.sodium || 0,
            transFat: food.trans_fat || 0,
            saturatedFat: food.saturated_fat || 0,
            cholesterol: food.cholesterol || 0
          };
        }
        return row;
      });
      
      setLocalNutrition(updatedNutrition);
      console.log('영양성분 정보가 업데이트되었습니다:', updatedNutrition);
      
      // 항상 부모 컴포넌트에 변경사항 전달
      safeNutritionChange(updatedNutrition);
      
      // 모달 닫기
      setShowSearchModal(false);
      setSearchQuery('');
      setSearchResults([]);
      
      // 성공 메시지 표시 (선택사항)
      alert(`${food.food_name || food.name}의 영양성분 정보가 적용되었습니다.`);
    } else {
      console.error('해당 재료의 영양성분 행을 찾을 수 없습니다:', selectedIngredient?.name);
      alert('영양성분 정보를 적용할 수 없습니다. 재료를 다시 선택해주세요.');
    }
  };

  return (
    <Card className="border-primary/20">
      <CardHeader className="border-b">
        <CardTitle className="flex items-center gap-2">
          <Badge variant="default" className="w-6 h-6 p-0 rounded-full">3</Badge>
          영양성분 입력
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        {/* 제품 정보 요약 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-muted/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">제품 기본 정보</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">제품명:</span>
                <span className="font-medium">{productName || '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">제품유형:</span>
                <span className="font-medium">{productType || '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">총 중량:</span>
                <span className="font-medium">{totalWeight}g</span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-muted/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">주요 성분</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {mainIngredients || '입력된 주요 성분이 없습니다.'}
              </p>
            </CardContent>
          </Card>
        </div>

        <Separator />

        {/* 영양성분 입력 테이블 */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">영양성분 정보</h3>
          </div>
          
          <div className="border rounded-lg overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>재료명</TableHead>
                  <TableHead>에너지 (kcal)</TableHead>
                  <TableHead>단백질 (g)</TableHead>
                  <TableHead>지방 (g)</TableHead>
                  <TableHead>탄수화물 (g)</TableHead>
                  <TableHead>당류 (g)</TableHead>
                  <TableHead>나트륨 (mg)</TableHead>
                  <TableHead>트랜스지방 (g)</TableHead>
                  <TableHead>포화지방 (g)</TableHead>
                  <TableHead>콜레스테롤 (mg)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {localNutrition.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{row.name}</TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={row.energy || ''}
                        onChange={(e) => handleNutritionChange(index, 'energy', parseFloat(e.target.value) || 0)}
                        className="w-20"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={row.protein || ''}
                        onChange={(e) => handleNutritionChange(index, 'protein', parseFloat(e.target.value) || 0)}
                        className="w-20"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={row.fat || ''}
                        onChange={(e) => handleNutritionChange(index, 'fat', parseFloat(e.target.value) || 0)}
                        className="w-20"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={row.carbohydrate || ''}
                        onChange={(e) => handleNutritionChange(index, 'carbohydrate', parseFloat(e.target.value) || 0)}
                        className="w-20"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={row.sugar || ''}
                        onChange={(e) => handleNutritionChange(index, 'sugar', parseFloat(e.target.value) || 0)}
                        className="w-20"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={row.sodium || ''}
                        onChange={(e) => handleNutritionChange(index, 'sodium', parseFloat(e.target.value) || 0)}
                        className="w-20"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={row.transFat || ''}
                        onChange={(e) => handleNutritionChange(index, 'transFat', parseFloat(e.target.value) || 0)}
                        className="w-20"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={row.saturatedFat || ''}
                        onChange={(e) => handleNutritionChange(index, 'saturatedFat', parseFloat(e.target.value) || 0)}
                        className="w-20"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={row.cholesterol || ''}
                        onChange={(e) => handleNutritionChange(index, 'cholesterol', parseFloat(e.target.value) || 0)}
                        className="w-20"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell className="font-medium">총계</TableCell>
                  <TableCell className="font-medium">{totals.energy.toFixed(1)}</TableCell>
                  <TableCell className="font-medium">{totals.protein.toFixed(1)}</TableCell>
                  <TableCell className="font-medium">{totals.fat.toFixed(1)}</TableCell>
                  <TableCell className="font-medium">{totals.carbohydrate.toFixed(1)}</TableCell>
                  <TableCell className="font-medium">{totals.sugar.toFixed(1)}</TableCell>
                  <TableCell className="font-medium">{totals.sodium.toFixed(1)}</TableCell>
                  <TableCell className="font-medium">{totals.transFat.toFixed(1)}</TableCell>
                  <TableCell className="font-medium">{totals.saturatedFat.toFixed(1)}</TableCell>
                  <TableCell className="font-medium">{totals.cholesterol.toFixed(1)}</TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </div>
        </div>

        <Separator />

        {/* 액션 버튼들 */}
        <div className="flex flex-col sm:flex-row gap-4 sm:justify-between sm:items-center">
          <div className="flex flex-wrap gap-2">
            <Button 
              variant="default" 
              size="sm"
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={handleDBConnect}
            >
              <Database className="mr-2 w-4 h-4" />
              DB 연결
            </Button>
            <Button 
              variant="secondary" 
              size="sm"
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              {/* <Bot className="mr-2 w-4 h-4" /> */}
              AI 분석
            </Button>
            <Button variant="outline" size="sm">
              {/* <Scale className="mr-2 w-4 h-4" /> */}
              법령 분석
            </Button>
            <Button variant="outline" size="sm">
              {/* <Calculator className="mr-2 w-4 h-4" /> */}
              자동 계산
            </Button>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Badge variant="outline">
              총 {localNutrition.length}개 제품 입력됨
            </Badge>
            <Badge 
              variant="outline" 
              className={`${
                isRatioOverLimit 
                  ? 'bg-red-50 text-red-700 border-red-300' 
                  : isRatioNearLimit 
                    ? 'bg-yellow-50 text-yellow-700 border-yellow-300'
                    : 'bg-green-50 text-green-700 border-green-300'
              }`}
            >
              배합비 합계: {totalRatio.toFixed(2)}%
              {isRatioOverLimit && ' ⚠️'}
              {isRatioNearLimit && !isRatioOverLimit && ' ⚠️'}
            </Badge>
          </div>
        </div>

        {/* 영양성분 요약 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-800">
            <CardContent className="p-3 text-center">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {totals.sodium.toFixed(2)}
              </div>
              <div className="text-xs text-orange-600 dark:text-orange-400">mg</div>
              <div className="text-xs text-muted-foreground">나트륨</div>
            </CardContent>
          </Card>
          
          <Card className="bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
            <CardContent className="p-3 text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {totals.carbohydrate.toFixed(2)}
              </div>
              <div className="text-xs text-green-600 dark:text-green-400">g</div>
              <div className="text-xs text-muted-foreground">탄수화물</div>
            </CardContent>
          </Card>
          
          <Card className="bg-purple-50 dark:bg-purple-950/20 border-purple-200 dark:border-purple-800">
            <CardContent className="p-3 text-center">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {totals.fat.toFixed(2)}
              </div>
              <div className="text-xs text-purple-600 dark:text-purple-400">g</div>
              <div className="text-xs text-muted-foreground">지방</div>
            </CardContent>
          </Card>
          
          <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
            <CardContent className="p-3 text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {totals.protein.toFixed(2)}
              </div>
              <div className="text-xs text-blue-600 dark:text-blue-400">g</div>
              <div className="text-xs text-muted-foreground">단백질</div>
            </CardContent>
          </Card>
        </div>

        {/* 도움말 */}
        <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <h5 className="font-medium text-blue-900 dark:text-blue-100 mb-2">💡 영양성분 입력 가이드</h5>
          <ul className="text-sm text-blue-700 dark:text-blue-200 space-y-1">
            <li>• <strong>배합비</strong>를 입력하면 100g 당 영양성분이 자동으로 계산됩니다.</li>
            <li>• <strong>배합비 합계는 100%를 초과할 수 없습니다.</strong> 95% 이상일 때 경고가 표시됩니다.</li>
            <li>• DB 연결을 통해 일반적인 식품의 영양성분을 불러올 수 있습니다.</li>
            <li>• AI 분석으로 재료 기반 영양성분을 추정할 수 있습니다.</li>
            <li>• 행 추가/삭제가 가능하며, 정확한 배합비 입력이 중요합니다.</li>
          </ul>
        </div>
      </CardContent>

      {/* 재료 선택 모달 */}
      <Dialog open={showIngredientModal} onOpenChange={setShowIngredientModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>재료 선택</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              영양성분 정보를 가져올 재료를 선택하세요.
            </p>
            <div className="space-y-2">
              {ingredients.map((ingredient, index) => (
                <div 
                  key={ingredient.id} 
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50"
                >
                  <div>
                    <span className="font-medium">{ingredient.name}</span>
                    <span className="text-sm text-muted-foreground ml-2">
                      ({ingredient.weight}g, {ingredient.ratio}%)
                    </span>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleIngredientSelect(ingredient)}
                  >
                    선택
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* 식품 검색 모달 */}
      <Dialog open={showSearchModal} onOpenChange={setShowSearchModal}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>식품 검색 - {selectedIngredient?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="식품명을 검색하세요"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <Button onClick={handleSearch} disabled={isSearching}>
                {isSearching ? (
                  <Loader2 className="w-4 h-4" />
                ) : (
                  <Search className="w-4 h-4" />
                )}
              </Button>
            </div>
            
            {isSearching ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
                <span className="ml-2 text-blue-500">검색 중...</span>
              </div>
            ) : null}

            {/* 검색 결과 (아래 블록만 사용) */}
            {searchResults.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium text-sm text-gray-700">검색 결과 ({searchResults.length}개)</h4>
                <div className="max-h-60 overflow-y-auto space-y-2">
                  {searchResults.map((food: any) => (
                    <div
                      key={food.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleFoodSelect(food)}
                    >
                      <div className="flex-1">
                        <div className="font-medium text-sm">{food.food_name || food.name}</div>
                        <div className="text-xs text-gray-500">
                          {food.energy ? `${food.energy}kcal` : '영양정보 없음'}
                          {food.protein ? ` | 단백질 ${food.protein}g` : ''}
                          {food.fat ? ` | 지방 ${food.fat}g` : ''}
                          {food.carbohydrate ? ` | 탄수화물 ${food.carbohydrate}g` : ''}
                        </div>
                      </div>
                      <Button size="sm" variant="outline">선택</Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 검색 결과가 없을 때 */}
            {!isSearching && searchQuery.trim() && searchResults.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Search className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                <p>검색 결과가 없습니다.</p>
                <p className="text-sm">다른 검색어를 시도해보세요.</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  )
}