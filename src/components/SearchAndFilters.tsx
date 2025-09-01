import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Search, Filter, User, Users, X, Tag } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

interface SearchAndFiltersProps {
  onSearchChange: (search: string) => void;
  onTagFilter: (tag: string) => void;
  onAuthorFilter: (filter: 'all' | 'own' | 'others') => void;
  selectedTags: string[];
  authorFilter: 'all' | 'own' | 'others';
  searchValue: string;
  availableTags: string[];
  isAuthenticated: boolean;
}

const SearchAndFilters = ({
  onSearchChange,
  onTagFilter,
  onAuthorFilter,
  selectedTags,
  authorFilter,
  searchValue,
  availableTags,
  isAuthenticated
}: SearchAndFiltersProps) => {
  const [showFilters, setShowFilters] = useState(false);
  const { t } = useLanguage();

  const clearFilters = () => {
    onSearchChange('');
    selectedTags.forEach(tag => onTagFilter(tag));
    onAuthorFilter('all');
  };

  const hasActiveFilters = searchValue || selectedTags.length > 0 || authorFilter !== 'all';

  return (
    <Card className="p-4 mb-6 bg-gradient-card border-0 shadow-soft">
      {/* Search Bar */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={t('search_posts')}
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 bg-background border-border/50 focus:border-primary"
        />
      </div>

      {/* Filter Toggle */}
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
          className="text-muted-foreground hover:text-foreground"
        >
          <Filter className="h-4 w-4 mr-2" />
          {t('filters')}
        </Button>
        
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-muted-foreground hover:text-destructive"
          >
            <X className="h-4 w-4 mr-1" />
            {t('clear_filters')}
          </Button>
        )}
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="space-y-4 pt-4 border-t border-border/50">
          {/* Author Filters */}
          {isAuthenticated && (
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                {t('author')}
              </label>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={authorFilter === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => onAuthorFilter('all')}
                  className="h-8"
                >
                  <Users className="h-3 w-3 mr-1" />
                  {t('all_posts')}
                </Button>
                <Button
                  variant={authorFilter === 'own' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => onAuthorFilter('own')}
                  className="h-8"
                >
                  <User className="h-3 w-3 mr-1" />
                  {t('my_posts')}
                </Button>
                <Button
                  variant={authorFilter === 'others' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => onAuthorFilter('others')}
                  className="h-8"
                >
                  <Users className="h-3 w-3 mr-1" />
                  {t('others_posts')}
                </Button>
              </div>
            </div>
          )}

          {/* Tags Filter */}
          {availableTags.length > 0 && (
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                {t('topics')}
              </label>
              <div className="flex flex-wrap gap-2">
                {availableTags.map((tag) => (
                  <Badge
                    key={tag}
                    variant={selectedTags.includes(tag) ? "default" : "secondary"}
                    className="cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => onTagFilter(tag)}
                  >
                    <Tag className="h-3 w-3 mr-1" />
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-border/50">
          {selectedTags.map((tag) => (
            <Badge
              key={tag}
              variant="outline"
              className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
              onClick={() => onTagFilter(tag)}
            >
              {tag}
              <X className="h-3 w-3 ml-1" />
            </Badge>
          ))}
          {authorFilter !== 'all' && (
            <Badge
              variant="outline"
              className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
              onClick={() => onAuthorFilter('all')}
            >
              {authorFilter === 'own' ? t('my_posts') : t('others_posts')}
              <X className="h-3 w-3 ml-1" />
            </Badge>
          )}
        </div>
      )}
    </Card>
  );
};

export default SearchAndFilters;